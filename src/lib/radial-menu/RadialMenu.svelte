<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { wedge, labelArc, radialPath } from './geometry';
	import { menuState } from '$lib/dock.svelte';
	import { colorForSection } from '$lib/themes';
	import type { MenuItem, DockPosition } from './types';

	let {
		items,
		size = 400,
		label = 'Menu',
		backLabel = 'Back',
		onnavigate
	}: {
		items: MenuItem[];
		size?: number;
		label?: string;
		backLabel?: string;
		/** Override navigation (defaults to SvelteKit `goto`). */
		onnavigate?: (href: string) => void;
	} = $props();

	const cx = $derived(size / 2);
	const cy = $derived(size / 2);
	const radius = $derived(size / 2 - 8);
	const sliceAngle = $derived(items.length ? 360 / items.length : 0);

	const CORNER_INWARD: Record<DockPosition, number> = {
		'bottom-left': 45,
		'top-left': 135,
		'top-right': 225,
		'bottom-right': 315,
		hub: 45
	};

	function cornerFor(midAngle: number): DockPosition {
		let best: DockPosition = 'bottom-left';
		let bestDist = Infinity;
		for (const key of ['bottom-left', 'top-left', 'top-right', 'bottom-right'] as DockPosition[]) {
			let d = Math.abs(midAngle - CORNER_INWARD[key]) % 360;
			d = Math.min(d, 360 - d);
			if (d < bestDist) {
				bestDist = d;
				best = key;
			}
		}
		return best;
	}

	function midAngleFor(i: number): number {
		const a = items.length ? 360 / items.length : 0;
		return i * a + a / 2;
	}

	function sectionIndexFor(path: string): number {
		let idx = -1;
		let bestLen = 0;
		items.forEach((it, i) => {
			const href = it.href;
			if (!href || href === '/') return;
			if (
				(path === href || path.startsWith(href + '/') || path.startsWith(href + '#')) &&
				href.length > bestLen
			) {
				bestLen = href.length;
				idx = i;
			}
		});
		return idx;
	}

	// State is derived from the route: home ('/') = hub (centered); a section
	// path = docked to that section's corner. Initialised from the path so
	// SSR/refresh render the right state with no flash.
	const initIdx = sectionIndexFor(page.url.pathname);
	let mode = $state<'hub' | 'docked'>(initIdx >= 0 ? 'docked' : 'hub');
	let selected = $state<number | null>(initIdx >= 0 ? initIdx : null);
	let corner = $state<DockPosition>(initIdx >= 0 ? cornerFor(midAngleFor(initIdx)) : 'bottom-left');
	let hovered = $state<number | null>(null);
	let focused = $state<number | null>(null);

	$effect(() => {
		const idx = sectionIndexFor(page.url.pathname);
		if (idx >= 0) {
			selected = idx;
			corner = cornerFor(midAngleFor(idx));
			mode = 'docked';
		} else {
			mode = 'hub';
			selected = null;
		}
	});

	// Publish docked state so the layout's corner scene knows what to grow, where.
	$effect(() => {
		if (mode === 'docked' && selected !== null) {
			menuState.sectionId = items[selected].id;
			menuState.corner = corner;
		} else {
			menuState.sectionId = null;
		}
	});

	// --- geometry ------------------------------------------------------------
	interface MainSlice {
		item: MenuItem;
		index: number;
		path: string;
		arc: string; // curved label baseline
		color: string;
	}
	interface SubSlice {
		item: MenuItem;
		index: number;
		path: string;
		radial: string; // lengthwise label baseline
	}

	const slices = $derived.by<MainSlice[]>(() =>
		items.map((item, index) => {
			const start = index * sliceAngle;
			const end = start + sliceAngle;
			return {
				item,
				index,
				path: wedge(cx, cy, radius, start, end),
				arc: labelArc(cx, cy, radius * 0.66, start + 3, end - 3),
				color: colorForSection(item.id)
			};
		})
	);

	// Children subdivide the selected slice's 90° span — the corner quarter.
	const childSlices = $derived.by<SubSlice[]>(() => {
		if (selected === null) return [];
		const parent = items[selected];
		const kids = parent?.children;
		if (!kids?.length) return [];
		const start0 = selected * sliceAngle;
		const step = sliceAngle / kids.length;
		return kids.map((item, index) => {
			const start = start0 + index * step;
			const end = start + step;
			const mid = (start + end) / 2;
			return {
				item,
				index,
				path: wedge(cx, cy, radius, start, end),
				radial: radialPath(cx, cy, radius * 0.32, radius * 0.92, mid)
			};
		});
	});

	// Bigger corner hub carrying the curved "Back" word, facing into the viewport.
	const backR = 66;
	const inward = $derived(CORNER_INWARD[corner] ?? 45);
	const backArc = $derived(labelArc(cx, cy, 44, inward - 40, inward + 40));

	// --- actions -------------------------------------------------------------
	function navigate(href?: string) {
		if (!href) return;
		(onnavigate ?? goto)(href);
	}

	function onKeydown(e: KeyboardEvent) {
		const n = items.length;
		if (!n) return;
		if (e.key === 'Escape') {
			navigate('/');
			e.preventDefault();
			return;
		}
		if (mode !== 'hub') return;
		switch (e.key) {
			case 'ArrowRight':
			case 'ArrowDown':
				focused = focused === null ? 0 : (focused + 1) % n;
				e.preventDefault();
				break;
			case 'ArrowLeft':
			case 'ArrowUp':
				focused = focused === null ? n - 1 : (focused - 1 + n) % n;
				e.preventDefault();
				break;
			case 'Enter':
			case ' ':
				if (focused !== null) navigate(items[focused].href);
				e.preventDefault();
				break;
		}
	}
</script>

<div class="menu-root" data-mode={mode} data-corner={corner} style="--size:{size}px">
	<svg
		width={size}
		height={size}
		viewBox="0 0 {size} {size}"
		role="menu"
		aria-label={label}
		tabindex="0"
		onkeydown={onKeydown}
	>
		<defs>
			{#each slices as slice (slice.item.id)}
				<path id="arc-{slice.item.id}" d={slice.arc} />
			{/each}
			{#each childSlices as sub (sub.item.id)}
				<path id="rad-{sub.item.id}" d={sub.radial} />
			{/each}
			<path id="back-arc" d={backArc} />
		</defs>

		<!-- Main wedges, each painted with its section's signature colour. -->
		{#each slices as slice (slice.item.id)}
			<path
				d={slice.path}
				class="slice"
				class:active={mode === 'hub' && (hovered ?? focused) === slice.index}
				class:faded={mode === 'docked' && selected !== slice.index}
				style="--slice-fill:{slice.color}"
				role="menuitem"
				aria-label={slice.item.label()}
				tabindex={focused === slice.index ? 0 : -1}
				aria-haspopup={slice.item.children ? 'true' : undefined}
				onmouseenter={() => (hovered = slice.index)}
				onmouseleave={() => (hovered = null)}
				onfocus={() => (focused = slice.index)}
				onclick={() => navigate(slice.item.href)}
				onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate(slice.item.href)}
			/>
		{/each}

		<!-- Curved main labels along each segment (hidden for the docked parent). -->
		{#each slices as slice (slice.item.id)}
			{#if !(mode === 'docked' && selected === slice.index)}
				<text class="label" class:faded={mode === 'docked'}>
					<textPath href="#arc-{slice.item.id}" startOffset="50%" text-anchor="middle">
						{slice.item.label()}
					</textPath>
				</text>
			{/if}
		{/each}

		<!-- Docked: sub-wedges filling the corner quarter, with lengthwise labels. -->
		{#if mode === 'docked'}
			{#each childSlices as sub (sub.item.id)}
				<path
					d={sub.path}
					class="slice sub"
					role="menuitem"
					aria-label={sub.item.label()}
					tabindex="0"
					onclick={() => navigate(sub.item.href)}
					onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate(sub.item.href)}
				/>
			{/each}
			{#each childSlices as sub (sub.item.id)}
				<text class="label sub">
					<textPath href="#rad-{sub.item.id}" startOffset="50%" text-anchor="middle">
						{sub.item.label()}
					</textPath>
				</text>
			{/each}

			<!-- Bigger corner hub = Back, with the word curved along its center. -->
			<circle
				{cx}
				{cy}
				r={backR}
				class="hub-back"
				role="button"
				aria-label={backLabel}
				tabindex="0"
				onclick={() => navigate('/')}
				onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate('/')}
			/>
			<text class="back-label">
				<textPath href="#back-arc" startOffset="50%" text-anchor="middle">{backLabel}</textPath>
			</text>
		{/if}
	</svg>
</div>

<style>
	.menu-root {
		position: fixed;
		top: 50%;
		left: 50%;
		width: var(--size);
		height: var(--size);
		transform: translate(-50%, -50%);
		transition: transform 700ms linear;
		z-index: 20;
	}
	.menu-root[data-mode='docked'][data-corner='bottom-left'] {
		transform: translate(-50%, -50%) translate(-50vw, 50vh);
	}
	.menu-root[data-mode='docked'][data-corner='top-left'] {
		transform: translate(-50%, -50%) translate(-50vw, -50vh);
	}
	.menu-root[data-mode='docked'][data-corner='top-right'] {
		transform: translate(-50%, -50%) translate(50vw, -50vh);
	}
	.menu-root[data-mode='docked'][data-corner='bottom-right'] {
		transform: translate(-50%, -50%) translate(50vw, 50vh);
	}

	svg {
		overflow: visible;
		outline: none;
	}

	.slice {
		fill: var(--slice-fill, var(--slice-bg, #7fb08a));
		stroke: var(--bg, #eef5ef);
		stroke-width: 2;
		cursor: pointer;
		transition:
			filter 0.2s ease,
			opacity 0.9s ease-out;
	}
	.slice:hover,
	.slice.active,
	.slice:focus-visible {
		filter: brightness(1.08) saturate(1.1);
		outline: none;
	}
	.slice.faded {
		opacity: 0;
		pointer-events: none;
	}
	.slice.sub {
		fill: var(--sub-bg, #d9a441);
	}
	.slice.sub:hover,
	.slice.sub:focus-visible {
		fill: var(--sub-active, #c48f2f);
	}

	.label {
		font-family: var(--font-ui, system-ui, sans-serif);
		font-size: 0.92rem;
		font-weight: 600;
		fill: #10131a;
		letter-spacing: 0.02em;
		pointer-events: none;
		user-select: none;
		transition: opacity 0.9s ease-out;
	}
	.label.faded {
		opacity: 0;
	}
	.label.sub {
		font-size: 0.8rem;
		fill: var(--label-sub-fg, #3a2a09);
		opacity: 1;
	}

	.hub-back {
		fill: var(--hub-bg, #2f4f3a);
		cursor: pointer;
		transition: filter 0.2s ease;
	}
	.hub-back:hover,
	.hub-back:focus-visible {
		filter: brightness(1.15);
		outline: none;
	}
	.back-label {
		font-family: var(--font-ui, system-ui, sans-serif);
		font-size: 0.82rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		fill: var(--on-hub, #eaf4ee);
		pointer-events: none;
		user-select: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.menu-root {
			transition: none;
		}
	}
</style>
