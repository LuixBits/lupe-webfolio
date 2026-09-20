<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { sectionIdForUrl } from './menu';
	import { wedge, labelArc, radialPath, polarToCartesian, annularSector } from './geometry';
	import { menuState } from '$lib/dock.svelte';
	import { colorForSection } from '$lib/themes';
	import { lighten, darken } from '$lib/color';
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

	// Route→section matching lives in menu.ts (sectionIdForUrl) so the layout's
	// theme and the wheel's dock state can never disagree.
	function sectionIndexFor(url: URL): number {
		const id = sectionIdForUrl(url);
		return id === null ? -1 : items.findIndex((it) => it.id === id);
	}

	// State is derived from the route: home ('/') = hub (centered); a section
	// path = docked to that section's corner. Initialised from the path so
	// SSR/refresh render the right state with no flash.
	const initIdx = sectionIndexFor(page.url);
	let mode = $state<'hub' | 'docked'>(initIdx >= 0 ? 'docked' : 'hub');
	let selected = $state<number | null>(initIdx >= 0 ? initIdx : null);
	let corner = $state<DockPosition>(initIdx >= 0 ? cornerFor(midAngleFor(initIdx)) : 'bottom-left');
	let hovered = $state<number | null>(null);
	let focused = $state<number | null>(null);

	// Taps during the 520ms dock/undock glide would hit whichever wedge happens
	// to be sliding under the finger (double-tapping Back could teleport into a
	// random section) — ignore wheel input while a glide is in flight.
	let gliding = $state(false);
	let glideTimer: ReturnType<typeof setTimeout> | undefined;
	let prevMode: 'hub' | 'docked' = initIdx >= 0 ? 'docked' : 'hub';

	// Small grace period on leave so the pointer can cross the gap between the
	// wedge and its outer sub-segment ring without the ring collapsing.
	let leaveTimer: ReturnType<typeof setTimeout> | undefined;
	function enterWedge(i: number) {
		clearTimeout(leaveTimer);
		hovered = i;
	}
	function leaveWedge() {
		clearTimeout(leaveTimer);
		leaveTimer = setTimeout(() => (hovered = null), 140);
	}

	$effect(() => {
		const idx = sectionIndexFor(page.url);
		if (idx >= 0) {
			selected = idx;
			corner = cornerFor(midAngleFor(idx));
			mode = 'docked';
		} else {
			mode = 'hub';
			selected = null;
		}
		// Keyboard focus doesn't survive navigation — clear it so a stale value
		// can't keep a hover ring expanded after returning to the hub.
		focused = null;
		fanOpen = false;
		if (mode !== prevMode) {
			prevMode = mode;
			gliding = true;
			clearTimeout(glideTimer);
			glideTimer = setTimeout(() => (gliding = false), 560);
		}
	});

	// Collapse the keyboard-driven ring when focus leaves the wheel entirely.
	function onFocusOut(e: FocusEvent) {
		const next = e.relatedTarget as Node | null;
		if (!next || !(e.currentTarget as Node).contains(next)) focused = null;
	}

	// --- mobile puck fan ------------------------------------------------------
	// On phones the docked wheel is a compact corner puck with the sub-wedges
	// hidden. Tapping the puck's quarter fans them open (the wheel grows to a
	// readable size); tapping outside, navigating, or tapping Back collapses.
	let rootEl = $state<HTMLDivElement | null>(null);
	let isMobile = $state(false);
	let fanOpen = $state(false);
	$effect(() => {
		const mq = window.matchMedia('(max-width: 560px), (max-height: 560px)');
		isMobile = mq.matches;
		const onChange = () => {
			isMobile = mq.matches;
			if (!mq.matches) fanOpen = false;
		};
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	});
	$effect(() => {
		if (!fanOpen) return;
		const onOutside = (e: PointerEvent) => {
			if (rootEl && !rootEl.contains(e.target as Node)) fanOpen = false;
		};
		document.addEventListener('pointerdown', onOutside, true);
		return () => document.removeEventListener('pointerdown', onOutside, true);
	});

	// While the reader scrolls, the mobile puck steps back to 40% opacity so the
	// corner it covers stays readable (CSS handles the fade).
	let scrolling = $state(false);
	let scrollTimer: ReturnType<typeof setTimeout> | undefined;
	$effect(() => {
		if (!(isMobile && mode === 'docked')) {
			scrolling = false;
			return;
		}
		const onScroll = () => {
			scrolling = true;
			clearTimeout(scrollTimer);
			scrollTimer = setTimeout(() => (scrolling = false), 220);
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', onScroll);
			clearTimeout(scrollTimer);
		};
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

	// The wedge whose sub-segments are on display: the selected one when docked,
	// the hovered/keyboard-focused one on the hub — hover previews exactly what
	// clicking gives you, inside the wedge's own quarter.
	const expandedIdx = $derived(mode === 'docked' ? selected : (hovered ?? focused));

	// --- per-wedge identity ---------------------------------------------------
	// Each wedge speaks its section's visual language: its theme's display type
	// plus a gradient + art derived from the section's signature colour.
	const WEDGE_TYPO: Record<string, string> = {
		about: "font-family:'Fraunces', Georgia, serif;",
		projects:
			"font-family:'Righteous', system-ui, sans-serif; text-transform:uppercase; letter-spacing:0.07em;",
		cv: "font-family:'Spectral', Georgia, serif; letter-spacing:0.03em;",
		hobbies: "font-family:'Space Grotesk', system-ui, sans-serif; letter-spacing:0.04em;"
	};

	// Wedges are windows into their worlds: fills echo each theme's actual
	// environment (pale meadow, dusk purple, dark red-nebula sky, pale water)
	// instead of a flat toy palette. `accent` drives the themed hover glow.
	const WEDGE_STYLE: Record<string, { g: [string, string, string]; label: string; accent: string }> =
		{
			about: { g: ['#f5faf5', '#d6ebdb', '#aed1b7'], label: '#12251a', accent: '#4f8a63' },
			projects: { g: ['#4b2a7d', '#2c1454', '#1b0a36'], label: '#ffe9ff', accent: '#ff5ed1' },
			hobbies: { g: ['#1d2447', '#10142e', '#090c1c'], label: '#e9edff', accent: '#ff7a67' },
			cv: { g: ['#f4fbfd', '#d3ecf4', '#abd9e7'], label: '#08313b', accent: '#2b9cba' }
		};
	const styleFor = (id: string) => WEDGE_STYLE[id] ?? WEDGE_STYLE.about;

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
		path: string; // docked: sub-wedge subdividing the parent quarter
		radial: string; // docked: lengthwise label baseline
		ring: string; // hub hover: annular segment in the outer ring
		ringArc: string; // hub hover: curved label baseline along the ring
		fill: string;
		fillHover: string;
		font: number; // px, shrunk so long labels fit the radial baseline
		ringFont: number; // px, shrunk so long labels fit the ring arc
	}

	// The hover ring: a second row of segments floating just outside the wheel,
	// confined to the parent wedge's quarter.
	const RING_GAP = 10;
	const RING_W = 56;
	// SVG canvas padding so the ring (and glows) never clip at the element box.
	const PAD = 88;

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

	// Children of the expanded slice. Docked: they subdivide the parent's 90°
	// quarter (the Back hub occupies the center, so labels start further out).
	// Hub hover: they form a second row — an outer ring confined to the quarter.
	const childSlices = $derived.by<SubSlice[]>(() => {
		if (expandedIdx === null) return [];
		const parent = items[expandedIdx];
		const kids = parent?.children;
		if (!kids?.length) return [];
		const base = colorForSection(parent.id);
		const rIn = 0.4;
		const rOut = 0.96;
		const pathLen = radius * (rOut - rIn);
		const ringMid = radius + RING_GAP + RING_W * 0.52;
		const start0 = expandedIdx * sliceAngle;
		const step = sliceAngle / kids.length;
		return kids.map((item, index) => {
			const start = start0 + index * step;
			const end = start + step;
			const mid = (start + end) / 2;
			const label = item.label();
			const arcLen = (((end - start - 4) * Math.PI) / 180) * ringMid;
			return {
				item,
				index,
				path: wedge(cx, cy, radius, start, end),
				radial: radialPath(cx, cy, radius * rIn, radius * rOut, mid),
				ring: annularSector(cx, cy, radius + RING_GAP, radius + RING_GAP + RING_W, start + 1.2, end - 1.2),
				ringArc: labelArc(cx, cy, ringMid, start + 2, end - 2),
				fill: lighten(base, index % 2 ? 0.42 : 0.28),
				fillHover: lighten(base, 0.14),
				font: Math.max(9, Math.min(13, (pathLen - 8) / (label.length * 0.6))),
				ringFont: Math.max(9.5, Math.min(13.5, (arcLen - 10) / (label.length * 0.62)))
			};
		});
	});

	// Invisible bridge covering the gap + ring band of the expanded quarter, so
	// the pointer can travel from the wedge onto the ring without a dead zone.
	const bridgePath = $derived.by(() => {
		if (expandedIdx === null) return '';
		const start = expandedIdx * sliceAngle;
		return annularSector(cx, cy, radius - 2, radius + RING_GAP + RING_W, start, start + sliceAngle);
	});

	// Bigger corner hub carrying the curved "Back" word, facing into the viewport.
	const backR = 66;
	const inward = $derived(CORNER_INWARD[corner] ?? 45);
	const backArc = $derived(labelArc(cx, cy, 44, inward - 40, inward + 40));

	// --- per-wedge art --------------------------------------------------------
	// Small themed compositions clipped inside each wedge, all positioned in
	// polar factors of the wheel radius so they scale with `size`.
	const art = $derived.by(() => {
		const p = (rf: number, a: number) => polarToCartesian(cx, cy, radius * rf, a);
		// about (270–360°): a leafy branch arcing toward the outer corner.
		const b0 = p(0.3, 296);
		const bc = p(0.66, 340);
		const b1 = p(0.95, 317);
		const q = (t: number) => ({
			x: (1 - t) * (1 - t) * b0.x + 2 * (1 - t) * t * bc.x + t * t * b1.x,
			y: (1 - t) * (1 - t) * b0.y + 2 * (1 - t) * t * bc.y + t * t * b1.y
		});
		const dq = (t: number) => ({
			x: 2 * (1 - t) * (bc.x - b0.x) + 2 * t * (b1.x - bc.x),
			y: 2 * (1 - t) * (bc.y - b0.y) + 2 * t * (b1.y - bc.y)
		});
		const leaves = [0.22, 0.42, 0.6, 0.76, 0.9].map((t, i) => {
			const pt = q(t);
			const d = dq(t);
			const ang = (Math.atan2(d.y, d.x) * 180) / Math.PI;
			return { x: pt.x, y: pt.y, rot: ang + (i % 2 ? 52 : -52) };
		});
		// hobbies (180–270°): a starfield with one faint constellation.
		const starPolar: [number, number, number][] = [
			[0.38, 205, 1.6],
			[0.55, 192, 2.2],
			[0.52, 238, 1.4],
			[0.7, 215, 2.6],
			[0.82, 201, 1.5],
			[0.66, 255, 2.0],
			[0.85, 246, 1.3],
			[0.42, 258, 1.8],
			[0.9, 228, 2.4],
			[0.3, 225, 1.2]
		];
		const stars = starPolar.map(([rf, a, r]) => ({ ...p(rf, a), r }));
		const constellation = [0, 3, 8, 6, 5]
			.map((i) => `${stars[i].x},${stars[i].y}`)
			.join(' ');
		// cv (90–180°): seigaiha — small overlapping fans, each a nest of rings.
		const scallops: { x: number; y: number }[] = [];
		for (let row = 0; row < 6; row++) {
			for (let col = 0; col < 8; col++) {
				scallops.push({
					x: cx + radius * (col * 0.13 + (row % 2 ? 0.065 : 0)),
					y: cy + radius * (0.2 + row * 0.135)
				});
			}
		}
		return {
			branch: `M ${b0.x} ${b0.y} Q ${bc.x} ${bc.y} ${b1.x} ${b1.y}`,
			leaves,
			stars,
			constellation,
			sparkles: [stars[1], stars[8]],
			scallops,
			scallopR: radius * 0.075,
			sun: { ...p(0.74, 28), r: radius * 0.13 },
			gridAngles: [10, 26, 58, 74],
			gridR: [0.52, 0.74, 0.95]
		};
	});

	function sparklePath(x: number, y: number, s: number): string {
		const k = s * 0.32;
		return `M ${x} ${y - s} L ${x + k} ${y - k} L ${x + s} ${y} L ${x + k} ${y + k} L ${x} ${y + s} L ${x - k} ${y + k} L ${x - s} ${y} L ${x - k} ${y - k} Z`;
	}

	// --- actions -------------------------------------------------------------
	// Localize at the single write chokepoint so a German visitor stays on
	// /de/* — raw menu hrefs are unprefixed and would silently switch locale.
	function navigate(href?: string) {
		if (!href || gliding) return;
		fanOpen = false;
		(onnavigate ?? goto)(localizeHref(href));
	}

	function onKeydown(e: KeyboardEvent) {
		const n = items.length;
		if (!n) return;
		if (e.key === 'Escape') {
			focused = null;
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

<div
	class="menu-root"
	class:fan-open={fanOpen}
	class:scrolling
	bind:this={rootEl}
	data-mode={mode}
	data-corner={corner}
	style="--size:{size}px"
>
	<svg
		class="wheel"
		viewBox="{-PAD} {-PAD} {size + PAD * 2} {size + PAD * 2}"
		role="menu"
		aria-label={label}
		tabindex="0"
		onkeydown={onKeydown}
		onfocusout={onFocusOut}
	>
		<defs>
			{#each slices as slice (slice.item.id)}
				<path id="arc-{slice.item.id}" d={slice.arc} />
				<clipPath id="clip-{slice.item.id}"><path d={slice.path} /></clipPath>
				<radialGradient
					id="grad-{slice.item.id}"
					gradientUnits="userSpaceOnUse"
					{cx}
					{cy}
					r={radius}
				>
					<stop offset="0%" stop-color={styleFor(slice.item.id).g[0]} />
					<stop offset="58%" stop-color={styleFor(slice.item.id).g[1]} />
					<stop offset="100%" stop-color={styleFor(slice.item.id).g[2]} />
				</radialGradient>
			{/each}
			{#each childSlices as sub (sub.item.id)}
				<path id="rad-{sub.item.id}" d={sub.radial} />
				<path id="ringarc-{sub.item.id}" d={sub.ringArc} />
			{/each}
			<path id="back-arc" d={backArc} />
			<clipPath id="clip-sun"><circle cx={art.sun.x} cy={art.sun.y} r={art.sun.r} /></clipPath>

		</defs>

		<!-- Main wedges. Each is a group: coloured wedge + clipped theme art +
		     curved label + (when expanded) its sub-wedges, so hover/glow/scale
		     apply to the whole quarter as one object. -->
		{#each slices as slice (slice.item.id)}
			<g
				class="wedge"
				class:faded={mode === 'docked' && selected !== slice.index}
				class:expanded={expandedIdx === slice.index && childSlices.length > 0}
				style="--wa:{styleFor(slice.item.id).accent}"
				onmouseenter={() => enterWedge(slice.index)}
				onmouseleave={leaveWedge}
				role="presentation"
			>
				<path
					d={slice.path}
					class="slice"
					fill="url(#grad-{slice.item.id})"
					role="menuitem"
					aria-label={slice.item.label()}
					tabindex={focused === slice.index ? 0 : -1}
					aria-haspopup={slice.item.children ? 'true' : undefined}
					onfocus={() => (focused = slice.index)}
					aria-expanded={mode === 'docked' && isMobile && selected === slice.index
						? fanOpen
						: undefined}
					onclick={() => {
						if (gliding) return;
						if (
							mode === 'docked' &&
							isMobile &&
							selected === slice.index &&
							slice.item.children?.length
						) {
							fanOpen = !fanOpen;
						} else {
							navigate(slice.item.href);
						}
					}}
					onkeydown={(e) => {
						if (e.key !== 'Enter' && e.key !== ' ') return;
						e.stopPropagation();
						e.preventDefault();
						navigate(slice.item.href);
					}}
				/>

				<!-- Themed art, clipped to the wedge, purely decorative. -->
				<g class="art" clip-path="url(#clip-{slice.item.id})" aria-hidden="true">
					{#if slice.item.id === 'projects'}
						{#each art.gridR as rf (rf)}
							<circle {cx} {cy} r={radius * rf} class="vapor-line" />
						{/each}
						{#each art.gridAngles as a (a)}
							{@const p1 = polarToCartesian(cx, cy, radius * 0.3, a)}
							{@const p2 = polarToCartesian(cx, cy, radius, a)}
							<line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} class="vapor-line" />
						{/each}
						<circle cx={art.sun.x} cy={art.sun.y} r={art.sun.r} class="vapor-sun" />
						<g clip-path="url(#clip-sun)">
							{#each [0.25, 0.5, 0.72, 0.9] as f (f)}
								<rect
									x={art.sun.x - art.sun.r}
									y={art.sun.y + art.sun.r * (f - 0.5) * 2 - 1.5}
									width={art.sun.r * 2}
									height={2 + f * 2.5}
									class="vapor-sun-stripe"
								/>
							{/each}
						</g>
					{:else if slice.item.id === 'cv'}
						{#each art.scallops as s, i (i)}
							<circle cx={s.x} cy={s.y} r={art.scallopR} class="water-scallop" />
							<circle cx={s.x} cy={s.y} r={art.scallopR * 0.62} class="water-scallop" />
							<circle cx={s.x} cy={s.y} r={art.scallopR * 0.28} class="water-scallop" />
						{/each}
					{:else if slice.item.id === 'hobbies'}
						<!-- soft H-alpha nebula wisp: stacked low-alpha ellipses -->
						{#each [[0.55, 225, 46, 26, -28], [0.62, 232, 30, 17, -20], [0.48, 218, 20, 12, -35]] as [rf, a, rx, ry, rot], i (i)}
							{@const p = polarToCartesian(cx, cy, radius * rf, a)}
							<ellipse
								cx={p.x}
								cy={p.y}
								{rx}
								{ry}
								transform="rotate({rot} {p.x} {p.y})"
								class="cosmos-nebula"
							/>
						{/each}
						<polyline points={art.constellation} class="cosmos-line" />
						{#each art.stars as s, i (i)}
							<circle cx={s.x} cy={s.y} r={s.r} class="cosmos-star" />
						{/each}
						{#each art.sparkles as s, i (i)}
							<path d={sparklePath(s.x, s.y, s.r * 3.2)} class="cosmos-sparkle" />
						{/each}
					{:else if slice.item.id === 'about'}
						<path d={art.branch} class="garden-stem" />
						{#each art.leaves as leaf, i (i)}
							<ellipse
								cx={leaf.x}
								cy={leaf.y}
								rx={radius * 0.055}
								ry={radius * 0.026}
								transform="rotate({leaf.rot} {leaf.x} {leaf.y})"
								class="garden-leaf"
								class:alt={i % 2 === 1}
							/>
						{/each}
					{/if}
				</g>

				<!-- Curved main label (fades while the wedge shows its children).
				     Very short labels (like "CV") get extra size + tracking. -->
				<text
					class="label"
					style="fill:{styleFor(slice.item.id).label}; {WEDGE_TYPO[slice.item.id] ?? ''}{slice
						.item.label().length <= 3
						? 'font-size:1.34rem; letter-spacing:0.14em;'
						: ''}"
				>
					<textPath href="#arc-{slice.item.id}" startOffset="50%" text-anchor="middle">
						{slice.item.label()}
					</textPath>
				</text>

				{#if mode === 'docked' && selected === slice.index}
					<!-- Docked: children subdivide the corner quarter, labels lengthwise. -->
					{#each childSlices as sub (sub.item.id)}
						<path
							d={sub.path}
							class="slice sub"
							style="--sub-fill:{sub.fill}; --sub-fill-hover:{sub.fillHover}; --i:{sub.index}"
							role="menuitem"
							aria-label={sub.item.label()}
							tabindex="0"
							onclick={(e) => {
								e.stopPropagation();
								navigate(sub.item.href);
							}}
							onkeydown={(e) => {
								if (e.key !== 'Enter' && e.key !== ' ') return;
								e.stopPropagation();
								e.preventDefault();
								navigate(sub.item.href);
							}}
						/>
					{/each}
					{#each childSlices as sub (sub.item.id)}
						<text
							class="label sub"
							style="--i:{sub.index}; font-size:{sub.font}px; {WEDGE_TYPO[slice.item.id] ?? ''}"
						>
							<textPath href="#rad-{sub.item.id}" startOffset="50%" text-anchor="middle">
								{sub.item.label()}
							</textPath>
						</text>
					{/each}
				{:else if mode === 'hub' && expandedIdx === slice.index}
					<!-- Hub hover/focus: a second row of segments blooms just outside the
					     wheel, confined to this wedge's quarter. The invisible bridge
					     keeps the pointer path from wedge to ring unbroken. -->
					<path d={bridgePath} class="bridge" role="presentation" />
					{#each childSlices as sub (sub.item.id)}
						<path
							d={sub.ring}
							class="slice ring-seg"
							style="--sub-fill:{sub.fill}; --sub-fill-hover:{sub.fillHover}; --i:{sub.index}"
							role="menuitem"
							aria-label={sub.item.label()}
							tabindex="0"
							onclick={(e) => {
								e.stopPropagation();
								navigate(sub.item.href);
							}}
							onkeydown={(e) => {
								if (e.key !== 'Enter' && e.key !== ' ') return;
								e.stopPropagation();
								e.preventDefault();
								navigate(sub.item.href);
							}}
						/>
					{/each}
					{#each childSlices as sub (sub.item.id)}
						<text
							class="label ring-label"
							style="--i:{sub.index}; font-size:{sub.ringFont}px; {WEDGE_TYPO[slice.item.id] ?? ''}"
						>
							<textPath href="#ringarc-{sub.item.id}" startOffset="50%" text-anchor="middle">
								{sub.item.label()}
							</textPath>
						</text>
					{/each}
				{/if}
			</g>
		{/each}

		<!-- Luminous outer rim: the same hairline language as the hub seams. -->
		<circle {cx} {cy} r={radius} class="rim" class:docked={mode === 'docked'} />

		{#if mode === 'docked'}
			{#if isMobile && !fanOpen}
				<!-- Invisible enlarged Back hit area: the painted quarter is ~40px on
				     a phone corner, under the 44px touch minimum. -->
				<circle
					{cx}
					{cy}
					r={100}
					class="hub-back-hit"
					aria-hidden="true"
					onclick={() => navigate('/')}
				/>
			{/if}
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
		/* Faster, eased slide to the corner — accelerates then settles. */
		transition: transform 520ms cubic-bezier(0.66, 0, 0.28, 1);
		z-index: 20;
		/* The root box and the padded svg canvas must not swallow clicks meant
		   for content beneath them — only the painted shapes hit-test. */
		pointer-events: none;
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
	/* Mobile toolbars resize the visual viewport but vh keeps the large-viewport
	   value, drifting the puck off its corner — dynamic units track the visible
	   viewport instead. */
	@supports (height: 1dvh) {
		.menu-root[data-mode='docked'][data-corner='bottom-left'] {
			transform: translate(-50%, -50%) translate(-50dvw, 50dvh);
		}
		.menu-root[data-mode='docked'][data-corner='top-left'] {
			transform: translate(-50%, -50%) translate(-50dvw, -50dvh);
		}
		.menu-root[data-mode='docked'][data-corner='top-right'] {
			transform: translate(-50%, -50%) translate(50dvw, -50dvh);
		}
		.menu-root[data-mode='docked'][data-corner='bottom-right'] {
			transform: translate(-50%, -50%) translate(50dvw, 50dvh);
		}
	}

	svg.wheel {
		/* Padded canvas: the hover ring lives outside the wheel, so the svg is
		   larger than the (unchanged) menu-root box. 22% pad = PAD 88 at size 400;
		   percentages so the mobile root-shrink scales the whole canvas. */
		position: absolute;
		inset: -22%;
		width: 144%;
		height: 144%;
		overflow: visible;
		outline: none;
		/* One quiet grounding shadow — the crisp rim does the framing. */
		filter: drop-shadow(0 10px 28px rgba(8, 10, 18, 0.3));
		touch-action: manipulation;
		-webkit-tap-highlight-color: transparent;
	}

	/* The whole quarter behaves as one object: it lifts on hover and fades as a
	   unit when another wedge is docked. */
	.wedge {
		transform-box: fill-box;
		transform-origin: center;
		transition:
			transform 240ms cubic-bezier(0.22, 1, 0.36, 1),
			opacity 500ms ease-out;
	}
	.wedge:hover:not(.faded) {
		transform: scale(1.03);
		filter: drop-shadow(0 0 16px color-mix(in srgb, var(--wa, #fff) 65%, transparent))
			brightness(1.05);
	}
	.wedge.faded {
		opacity: 0;
		pointer-events: none;
	}
	/* The slices' explicit pointer-events must not resurrect a faded wedge. */
	.wedge.faded .slice {
		pointer-events: none;
	}

	.slice {
		/* Same luminous hairline as the hub seams — the wheel's internal cross. */
		stroke: rgba(235, 242, 255, 0.38);
		stroke-width: 1.25;
		stroke-linejoin: round;
		cursor: pointer;
		pointer-events: visiblePainted; /* re-enable under the root's none */
		outline: none; /* keyboard focus is shown via the themed glow, not the UA box */
	}
	.slice:focus-visible {
		filter: drop-shadow(0 0 12px color-mix(in srgb, var(--wa, #fff) 70%, transparent));
		outline: none;
	}

	.art {
		pointer-events: none;
		opacity: 0.85;
	}
	.vapor-line {
		fill: none;
		stroke: #ff5ed1;
		stroke-width: 1;
		opacity: 0.4;
	}
	.vapor-sun {
		fill: #ffd36e;
		opacity: 0.9;
	}
	.vapor-sun-stripe {
		fill: #ff8ad9;
		opacity: 0.95;
	}
	.water-scallop {
		fill: none;
		stroke: #1e5f6f;
		stroke-width: 1;
		opacity: 0.22;
	}
	.cosmos-star {
		fill: #eaf4ff;
		opacity: 0.95;
	}
	.cosmos-nebula {
		fill: #c94848;
		opacity: 0.11;
	}
	.cosmos-line {
		fill: none;
		stroke: #cfe6ff;
		stroke-width: 0.8;
		opacity: 0.45;
	}
	.cosmos-sparkle {
		fill: #ffffff;
		opacity: 0.9;
	}
	.garden-stem {
		fill: none;
		stroke: #2f4f3a;
		stroke-width: 2.4;
		opacity: 0.55;
		stroke-linecap: round;
	}
	.garden-leaf {
		fill: #2f4f3a;
		opacity: 0.45;
	}
	.garden-leaf.alt {
		fill: #eaf4ee;
		opacity: 0.55;
	}

	.label {
		font-size: 1.16rem;
		font-weight: 600;
		fill: #10131a;
		letter-spacing: 0.02em;
		text-rendering: optimizeLegibility;
		pointer-events: none;
		user-select: none;
		transition:
			opacity 260ms ease,
			letter-spacing 240ms ease;
	}
	/* Invisible hover bridge between wedge and ring. */
	.bridge {
		fill: transparent;
		stroke: none;
		pointer-events: all;
	}

	/* The hover ring: a second row of segments outside the wheel. */
	.slice.ring-seg {
		fill: var(--sub-fill, #d9a441);
		stroke-width: 1.25;
		transform-box: fill-box;
		transform-origin: center;
		animation: sub-in 240ms cubic-bezier(0.34, 1.3, 0.5, 1) both;
		animation-delay: calc(var(--i, 0) * 40ms);
		transition: fill 160ms ease;
	}
	.slice.ring-seg:hover,
	.slice.ring-seg:focus-visible {
		fill: var(--sub-fill-hover, #c48f2f);
		filter: drop-shadow(0 0 10px color-mix(in srgb, var(--wa, #fff) 60%, transparent));
	}
	.label.ring-label {
		fill: #10131a;
		font-weight: 600;
		animation: sub-in 240ms ease both;
		animation-delay: calc(var(--i, 0) * 40ms + 30ms);
	}

	/* Sub-wedges bloom in: a quick staggered fade-and-grow per child. */
	.slice.sub {
		fill: var(--sub-fill, #d9a441);
		stroke-width: 1.25;
		transform-box: fill-box;
		transform-origin: center;
		animation: sub-in 260ms cubic-bezier(0.34, 1.3, 0.5, 1) both;
		animation-delay: calc(var(--i, 0) * 45ms);
		transition: fill 160ms ease;
	}
	.slice.sub:hover,
	.slice.sub:focus-visible {
		fill: var(--sub-fill-hover, #c48f2f);
	}
	.label.sub {
		fill: #10131a;
		font-weight: 600;
		animation: sub-in 260ms ease both;
		animation-delay: calc(var(--i, 0) * 45ms + 40ms);
	}
	@keyframes sub-in {
		from {
			opacity: 0;
			transform: scale(0.88);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.hub-back-hit {
		fill: transparent;
		stroke: none;
		pointer-events: all;
		cursor: pointer;
	}

	.hub-back {
		fill: var(--hub-bg, #2f4f3a);
		stroke: rgba(235, 242, 255, 0.45);
		stroke-width: 1.25;
		cursor: pointer;
		pointer-events: visiblePainted; /* re-enable under the root's none */
		transform-box: fill-box;
		transform-origin: center;
		transition:
			transform 280ms cubic-bezier(0.22, 1, 0.36, 1),
			filter 200ms ease,
			stroke-width 200ms ease;
	}
	/* Gentle breathing while at rest (kept off the interactive states so the
	   hover/press transforms are not fought by the animation). */
	.hub-back:not(:hover):not(:focus-visible):not(:active) {
		animation:
			back-in 220ms ease 260ms backwards,
			rm-breathe 7s ease-in-out 500ms infinite;
	}
	.back-label {
		animation: back-in 220ms ease 260ms backwards;
	}
	@keyframes back-in {
		from {
			opacity: 0;
		}
	}
	.hub-back:hover,
	.hub-back:focus-visible {
		filter: brightness(1.25) drop-shadow(0 0 12px color-mix(in srgb, var(--accent, #fff) 55%, transparent));
		transform: scale(1.045);
		stroke-width: 1.75;
		outline: none;
	}
	.hub-back:active {
		transform: scale(1.01);
	}
	@keyframes rm-breathe {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.018);
		}
	}

	.back-label {
		font-family: var(--font-display, var(--font-ui, system-ui, sans-serif));
		font-size: 0.82rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		fill: var(--on-hub, #eaf4ee);
		pointer-events: none;
		user-select: none;
	}

	.rim {
		fill: none;
		stroke: rgba(235, 242, 255, 0.5);
		stroke-width: 1.25;
		pointer-events: none;
	}
	/* Docked: the rim arc still frames the visible quarter. */
	.rim.docked {
		stroke: rgba(235, 242, 255, 0.35);
	}

	/* Shrink the wheel on small screens so it never overflows — including short
	   landscape phones, which are wide but have almost no height. */
	@media (max-width: 560px), (max-height: 560px) {
		.menu-root {
			width: min(86vmin, 400px);
			height: min(86vmin, 400px);
		}
		/* Docked on mobile: a compact corner puck. The quarter keeps its themed
		   art + section name and the Back hub stays a comfortable tap target,
		   but the sub-wedges are dropped — their labels can't stay legible at
		   this size, and the section content they anchor to is right there to
		   scroll. Content stays readable underneath. */
		.menu-root[data-mode='docked'] {
			width: 240px;
			height: 240px;
			transition:
				transform 520ms cubic-bezier(0.66, 0, 0.28, 1),
				width 320ms cubic-bezier(0.22, 1, 0.36, 1),
				height 320ms cubic-bezier(0.22, 1, 0.36, 1);
		}
		/* While the reader scrolls, the puck steps back so the text under the
		   corner stays readable; it returns as soon as scrolling rests. */
		.menu-root[data-mode='docked'] {
			transition:
				transform 520ms cubic-bezier(0.66, 0, 0.28, 1),
				width 320ms cubic-bezier(0.22, 1, 0.36, 1),
				height 320ms cubic-bezier(0.22, 1, 0.36, 1),
				opacity 220ms ease;
		}
		.menu-root[data-mode='docked'].scrolling:not(.fan-open) {
			opacity: 0.4;
		}
		/* Tapping the puck fans the sub-wedges open at a readable size. */
		.menu-root[data-mode='docked'].fan-open {
			width: min(88vw, 400px);
			height: min(88vw, 400px);
		}
		.menu-root[data-mode='docked']:not(.fan-open) .slice.sub,
		.menu-root[data-mode='docked']:not(.fan-open) .label.sub {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.menu-root,
		.wedge,
		.slice,
		.label,
		.hub-back {
			transition: none;
		}
		/* No scale lifts — the glow states remain as static feedback. */
		.wedge:hover:not(.faded) {
			transform: none;
		}
		.slice.sub,
		.label.sub,
		.slice.ring-seg,
		.label.ring-label {
			animation: none;
		}
		.hub-back,
		.hub-back:not(:hover):not(:focus-visible):not(:active) {
			animation: none;
		}
		.hub-back:hover,
		.hub-back:focus-visible,
		.hub-back:active {
			transform: none;
		}
	}
</style>
