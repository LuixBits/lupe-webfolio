<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { wedge, labelArc, radialPath, polarToCartesian } from './geometry';
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
		fill: string;
		fillHover: string;
		font: number; // px, shrunk so long labels fit the radial baseline
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

	// Children subdivide the expanded slice's 90° span. When docked the Back hub
	// occupies the center, so the label baselines start further out.
	const childSlices = $derived.by<SubSlice[]>(() => {
		if (expandedIdx === null) return [];
		const parent = items[expandedIdx];
		const kids = parent?.children;
		if (!kids?.length) return [];
		const base = colorForSection(parent.id);
		const rIn = mode === 'docked' ? 0.4 : 0.3;
		const rOut = 0.96;
		const pathLen = radius * (rOut - rIn);
		const start0 = expandedIdx * sliceAngle;
		const step = sliceAngle / kids.length;
		return kids.map((item, index) => {
			const start = start0 + index * step;
			const end = start + step;
			const mid = (start + end) / 2;
			const label = item.label();
			return {
				item,
				index,
				path: wedge(cx, cy, radius, start, end),
				radial: radialPath(cx, cy, radius * rIn, radius * rOut, mid),
				fill: lighten(base, index % 2 ? 0.42 : 0.28),
				fillHover: lighten(base, 0.14),
				font: Math.max(9, Math.min(13, (pathLen - 8) / (label.length * 0.6)))
			};
		});
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
		width="100%"
		height="100%"
		viewBox="0 0 {size} {size}"
		role="menu"
		aria-label={label}
		tabindex="0"
		onkeydown={onKeydown}
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
					<stop offset="0%" stop-color={lighten(slice.color, 0.24)} />
					<stop offset="58%" stop-color={slice.color} />
					<stop offset="100%" stop-color={darken(slice.color, 0.15)} />
				</radialGradient>
			{/each}
			{#each childSlices as sub (sub.item.id)}
				<path id="rad-{sub.item.id}" d={sub.radial} />
			{/each}
			<path id="back-arc" d={backArc} />
			<clipPath id="clip-sun"><circle cx={art.sun.x} cy={art.sun.y} r={art.sun.r} /></clipPath>

			<!-- ===== Premium wheel finish (visual layer only) =====================
			     Wedge finish: a blurred-alpha bump map drives a soft specular sheen
			     along each wedge's edges, plus an inset vignette ring for depth. The
			     distant light sways slowly for a quiet idle shimmer; reduced-motion
			     swaps in the still twin. -->
			<filter id="rm-sheen" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">
				<feGaussianBlur in="SourceAlpha" stdDeviation="5" result="bump" />
				<feSpecularLighting in="bump" surfaceScale="1.7" specularConstant="0.42" specularExponent="15" lighting-color="#ffffff" result="spec">
					<feDistantLight azimuth="235" elevation="56">
						<animate
							attributeName="azimuth"
							values="205;295;205"
							keyTimes="0;0.5;1"
							calcMode="spline"
							keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
							dur="26s"
							repeatCount="indefinite"
						/>
					</feDistantLight>
				</feSpecularLighting>
				<feComposite in="spec" in2="SourceAlpha" operator="in" result="sheen" />
				<feComposite in="SourceAlpha" in2="bump" operator="arithmetic" k1="0" k2="1" k3="-1" k4="0" result="ring0" />
				<feComponentTransfer in="ring0" result="ring">
					<feFuncA type="linear" slope="0.3" />
				</feComponentTransfer>
				<feMerge>
					<feMergeNode in="SourceGraphic" />
					<feMergeNode in="ring" />
					<feMergeNode in="sheen" />
				</feMerge>
			</filter>

			<!-- Still twin of #rm-sheen, used when the user prefers reduced motion. -->
			<filter id="rm-sheen-still" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">
				<feGaussianBlur in="SourceAlpha" stdDeviation="5" result="bump" />
				<feSpecularLighting in="bump" surfaceScale="1.7" specularConstant="0.42" specularExponent="15" lighting-color="#ffffff" result="spec">
					<feDistantLight azimuth="235" elevation="56" />
				</feSpecularLighting>
				<feComposite in="spec" in2="SourceAlpha" operator="in" result="sheen" />
				<feComposite in="SourceAlpha" in2="bump" operator="arithmetic" k1="0" k2="1" k3="-1" k4="0" result="ring0" />
				<feComponentTransfer in="ring0" result="ring">
					<feFuncA type="linear" slope="0.3" />
				</feComponentTransfer>
				<feMerge>
					<feMergeNode in="SourceGraphic" />
					<feMergeNode in="ring" />
					<feMergeNode in="sheen" />
				</feMerge>
			</filter>

			<!-- Hover / active / focus: the halo is made by blurring + saturating the
			     slice itself, so the glow is automatically themed per wedge colour. -->
			<filter id="rm-glow" x="-45%" y="-45%" width="190%" height="190%" color-interpolation-filters="sRGB">
				<feGaussianBlur in="SourceGraphic" stdDeviation="10" result="h0" />
				<feColorMatrix in="h0" type="saturate" values="1.6" result="h1" />
				<feComponentTransfer in="h1" result="halo">
					<feFuncA type="linear" slope="0.8" />
				</feComponentTransfer>
				<feGaussianBlur in="SourceAlpha" stdDeviation="6" result="d0" />
				<feOffset in="d0" dy="5" result="d1" />
				<feFlood flood-color="#10131a" flood-opacity="0.25" result="dc" />
				<feComposite in="dc" in2="d1" operator="in" result="lift" />
				<feGaussianBlur in="SourceAlpha" stdDeviation="5" result="bump" />
				<feSpecularLighting in="bump" surfaceScale="2" specularConstant="0.65" specularExponent="17" lighting-color="#ffffff" result="spec">
					<feDistantLight azimuth="235" elevation="60" />
				</feSpecularLighting>
				<feComposite in="spec" in2="SourceAlpha" operator="in" result="sheen" />
				<feComposite in="SourceAlpha" in2="bump" operator="arithmetic" k1="0" k2="1" k3="-1" k4="0" result="ring0" />
				<feComponentTransfer in="ring0" result="ring">
					<feFuncA type="linear" slope="0.2" />
				</feComponentTransfer>
				<feMerge>
					<feMergeNode in="halo" />
					<feMergeNode in="lift" />
					<feMergeNode in="SourceGraphic" />
					<feMergeNode in="ring" />
					<feMergeNode in="sheen" />
				</feMerge>
			</filter>

			<!-- Back hub as a jewel: dome bump map -> tight top gleam + low cool rim
			     light, inner vignette for the cabochon curve, grounding shadow. -->
			<filter id="rm-hub" x="-40%" y="-40%" width="180%" height="180%" color-interpolation-filters="sRGB">
				<feGaussianBlur in="SourceAlpha" stdDeviation="7" result="d0" />
				<feOffset in="d0" dy="4" result="d1" />
				<feFlood flood-color="#10131a" flood-opacity="0.3" result="dc" />
				<feComposite in="dc" in2="d1" operator="in" result="ground" />
				<feGaussianBlur in="SourceAlpha" stdDeviation="13" result="dome" />
				<feSpecularLighting in="dome" surfaceScale="3.2" specularConstant="0.8" specularExponent="24" lighting-color="#ffffff" result="g0">
					<feDistantLight azimuth="235" elevation="62" />
				</feSpecularLighting>
				<feComposite in="g0" in2="SourceAlpha" operator="in" result="gleam" />
				<feSpecularLighting in="dome" surfaceScale="2.2" specularConstant="0.3" specularExponent="8" lighting-color="#ffffff" result="r0">
					<feDistantLight azimuth="55" elevation="16" />
				</feSpecularLighting>
				<feComposite in="r0" in2="SourceAlpha" operator="in" result="rimlight" />
				<feComposite in="SourceAlpha" in2="dome" operator="arithmetic" k1="0" k2="1" k3="-1" k4="0" result="v0" />
				<feComponentTransfer in="v0" result="vignette">
					<feFuncA type="linear" slope="0.35" />
				</feComponentTransfer>
				<feMerge>
					<feMergeNode in="ground" />
					<feMergeNode in="SourceGraphic" />
					<feMergeNode in="vignette" />
					<feMergeNode in="rimlight" />
					<feMergeNode in="gleam" />
				</feMerge>
			</filter>

			<!-- Hub on hover/focus: same jewel plus a self-coloured halo. -->
			<filter id="rm-hub-glow" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
				<feGaussianBlur in="SourceGraphic" stdDeviation="12" result="h0" />
				<feColorMatrix in="h0" type="saturate" values="1.5" result="h1" />
				<feComponentTransfer in="h1" result="halo">
					<feFuncA type="linear" slope="0.75" />
				</feComponentTransfer>
				<feGaussianBlur in="SourceAlpha" stdDeviation="8" result="d0" />
				<feOffset in="d0" dy="5" result="d1" />
				<feFlood flood-color="#10131a" flood-opacity="0.32" result="dc" />
				<feComposite in="dc" in2="d1" operator="in" result="ground" />
				<feGaussianBlur in="SourceAlpha" stdDeviation="13" result="dome" />
				<feSpecularLighting in="dome" surfaceScale="3.4" specularConstant="0.95" specularExponent="24" lighting-color="#ffffff" result="g0">
					<feDistantLight azimuth="235" elevation="62" />
				</feSpecularLighting>
				<feComposite in="g0" in2="SourceAlpha" operator="in" result="gleam" />
				<feSpecularLighting in="dome" surfaceScale="2.2" specularConstant="0.4" specularExponent="8" lighting-color="#ffffff" result="r0">
					<feDistantLight azimuth="55" elevation="16" />
				</feSpecularLighting>
				<feComposite in="r0" in2="SourceAlpha" operator="in" result="rimlight" />
				<feComposite in="SourceAlpha" in2="dome" operator="arithmetic" k1="0" k2="1" k3="-1" k4="0" result="v0" />
				<feComponentTransfer in="v0" result="vignette">
					<feFuncA type="linear" slope="0.3" />
				</feComponentTransfer>
				<feMerge>
					<feMergeNode in="halo" />
					<feMergeNode in="ground" />
					<feMergeNode in="SourceGraphic" />
					<feMergeNode in="vignette" />
					<feMergeNode in="rimlight" />
					<feMergeNode in="gleam" />
				</feMerge>
			</filter>
		</defs>

		<!-- Main wedges. Each is a group: coloured wedge + clipped theme art +
		     curved label + (when expanded) its sub-wedges, so hover/glow/scale
		     apply to the whole quarter as one object. -->
		{#each slices as slice (slice.item.id)}
			<g
				class="wedge"
				class:faded={mode === 'docked' && selected !== slice.index}
				class:expanded={expandedIdx === slice.index && childSlices.length > 0}
				onmouseenter={() => (hovered = slice.index)}
				onmouseleave={() => (hovered = null)}
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
					onclick={() => navigate(slice.item.href)}
					onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate(slice.item.href)}
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
					style="{WEDGE_TYPO[slice.item.id] ?? ''}{slice.item.label().length <= 3
						? 'font-size:1.34rem; letter-spacing:0.14em;'
						: ''}"
				>
					<textPath href="#arc-{slice.item.id}" startOffset="50%" text-anchor="middle">
						{slice.item.label()}
					</textPath>
				</text>

				<!-- Sub-wedges: the wedge subdivides into its children — shown docked,
				     and previewed on hub hover/focus, right in the wedge's space. -->
				{#if expandedIdx === slice.index}
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
							onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate(sub.item.href)}
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
				{/if}
			</g>
		{/each}

		{#if mode === 'docked'}
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
		/* Whole-wheel ambient shadow: a soft floating ring under the disk. */
		filter: drop-shadow(0 24px 48px rgba(16, 19, 26, 0.18))
			drop-shadow(0 2px 8px rgba(16, 19, 26, 0.1));
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
	}
	.wedge.faded {
		opacity: 0;
		pointer-events: none;
	}

	.slice {
		stroke: var(--bg, #10131b);
		stroke-width: 1.5;
		stroke-linejoin: round;
		cursor: pointer;
		/* Per-wedge sheen + inset vignette; the light inside sways slowly for
		   idle life (reduced-motion swaps in the still twin below). */
		filter: url(#rm-sheen);
	}
	.wedge:hover .slice:not(.sub),
	.slice:focus-visible,
	.slice:active {
		filter: url(#rm-glow);
		outline: none;
	}

	.art {
		pointer-events: none;
		opacity: 0.85;
		transition: opacity 240ms ease;
	}
	/* Art yields while the children are on display so labels stay legible. */
	.wedge.expanded .art {
		opacity: 0.25;
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
	.wedge.expanded > .label:not(.sub) {
		opacity: 0;
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

	.hub-back {
		fill: var(--hub-bg, #2f4f3a);
		/* Hairline accent ring: the jewel's setting. */
		stroke: var(--accent, #d9a441);
		stroke-width: 1.25;
		cursor: pointer;
		filter: url(#rm-hub);
		transform-box: fill-box;
		transform-origin: center;
		transition:
			transform 280ms cubic-bezier(0.22, 1, 0.36, 1),
			stroke-width 200ms ease;
	}
	/* Gentle breathing while at rest (kept off the interactive states so the
	   hover/press transforms are not fought by the animation). */
	.hub-back:not(:hover):not(:focus-visible):not(:active) {
		animation: rm-breathe 7s ease-in-out infinite;
	}
	.hub-back:hover,
	.hub-back:focus-visible {
		filter: url(#rm-hub-glow);
		transform: scale(1.045);
		stroke-width: 2;
		outline: none;
	}
	.hub-back:active {
		filter: url(#rm-hub-glow);
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

	/* Shrink the wheel on small screens so it never overflows. */
	@media (max-width: 560px) {
		.menu-root {
			width: min(86vw, 400px);
			height: min(86vw, 400px);
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
		/* Still sheen (no SMIL light sway), no breathing, no scale — the glow
		   states remain as static feedback. */
		.slice {
			filter: url(#rm-sheen-still);
		}
		.wedge:hover:not(.faded) {
			transform: none;
		}
		.slice.sub,
		.label.sub {
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
