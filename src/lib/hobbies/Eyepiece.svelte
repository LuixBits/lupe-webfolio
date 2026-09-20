<script lang="ts">
	import type { Album } from '$lib/content/schema';
	import { resolveLocalized } from '$lib/content/schema';
	import Video from '$lib/content/Video.svelte';
	import * as m from '$lib/paraglide/messages';

	/** Full-screen plate viewer: a native <dialog> (top layer, focus containment,
	 *  Esc for free) holding a scroll-snap track — one slide per media item, so
	 *  swiping between plates is native touch scroll. The parent owns the open
	 *  state via shallow routing: it mounts this component with the plate index
	 *  and passes `onclose` (history.back()), so hardware Back also closes. */
	let {
		album,
		designation,
		start = 0,
		locale,
		onclose
	}: {
		album: Album;
		designation: string;
		start?: number;
		locale: string;
		onclose: () => void;
	} = $props();

	let dialog: HTMLDialogElement;
	let track: HTMLDivElement;

	let active = $state(start);
	/** Index of the video slide the visitor explicitly started, if any. */
	let playing = $state<number | null>(null);

	const count = album.media.length;
	const plateId = (i: number) => `${designation}·${i + 1}`;

	const reducedMotion = () =>
		typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

	function goTo(i: number) {
		const clamped = Math.max(0, Math.min(count - 1, i));
		track?.scrollTo({
			left: clamped * track.clientWidth,
			behavior: reducedMotion() ? 'auto' : 'smooth'
		});
	}

	let raf = 0;
	function onScroll() {
		cancelAnimationFrame(raf);
		raf = requestAnimationFrame(() => {
			if (track?.clientWidth) active = Math.round(track.scrollLeft / track.clientWidth);
		});
	}

	// Swiping away from a running video tears its iframe/element down.
	$effect(() => {
		if (playing !== null && playing !== active) playing = null;
	});

	$effect(() => {
		dialog.showModal();
		// Land on the opening plate before the first painted frame.
		track.scrollLeft = start * track.clientWidth;
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden'; // modal top layer + no page scroll behind
		const onResize = () => {
			track.scrollLeft = active * track.clientWidth; // re-snap after rotation/resize
		};
		window.addEventListener('resize', onResize);
		return () => {
			window.removeEventListener('resize', onResize);
			document.body.style.overflow = prevOverflow;
			cancelAnimationFrame(raf);
		};
	});

	/** Esc: keep the dialog under history's control — close via history.back(). */
	function onCancel(e: Event) {
		e.preventDefault();
		onclose();
	}
	/** Fallback: if the browser force-closes anyway, still unwind the history entry. */
	function onNativeClose() {
		onclose();
	}
	/** Backdrop tap: empty space around the plate (never the image/log/buttons). */
	function onDialogClick(e: MouseEvent) {
		const t = e.target as HTMLElement;
		if (t === dialog || 'backdrop' in t.dataset) onclose();
	}
	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowRight') {
			e.preventDefault();
			goTo(active + 1);
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			goTo(active - 1);
		}
	}

	function formatDate(iso: string): string {
		const [y, mo, d] = iso.split('-').map(Number);
		return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-GB', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(new Date(y, mo - 1, d));
	}
</script>

<dialog
	bind:this={dialog}
	class="eyepiece"
	aria-label={`${resolveLocalized(album.title, locale)} — ${m.eyepiece_plate()} ${plateId(active)}`}
	oncancel={onCancel}
	onclose={onNativeClose}
	onclick={onDialogClick}
	onkeydown={onKeydown}
>
	<header class="bar">
		<p class="counter" aria-live="polite">
			<span class="mark" aria-hidden="true">✶</span>
			{m.eyepiece_plate()}
			{plateId(active)}
			<span class="of">· {active + 1} {m.eyepiece_of()} {count}</span>
		</p>
		<button class="close" type="button" onclick={onclose} aria-label={m.eyepiece_close()}>
			<span aria-hidden="true">✕</span><span class="close-word">{m.eyepiece_close()}</span>
		</button>
	</header>

	<div class="track" bind:this={track} onscroll={onScroll} data-backdrop>
		{#each album.media as item, i (item.id)}
			{@const near = Math.abs(i - active) <= 1}
			{@const cap = item.caption ? resolveLocalized(item.caption, locale) : undefined}
			<section class="slide" data-backdrop inert={i !== active}>
				<figure class="view" data-backdrop>
					{#if item.kind === 'video'}
						{#if playing === i}
							<div class="player">
								<Video
									video={{
										id: item.id,
										title: cap ?? item.id,
										provider: item.provider ?? 'file',
										src: item.src,
										poster: item.poster
									}}
								/>
							</div>
						{:else}
							<button class="facade" type="button" onclick={() => (playing = i)}>
								<span class="tri" aria-hidden="true">▸</span>
								<span class="facade-cap">{cap ?? item.id}</span>
							</button>
						{/if}
					{:else if item.image}
						<!-- Full-res only for active ±1; far slides hold the thumb, dimmed. -->
						<img
							src={near ? item.image.src : (item.image.thumb ?? item.image.src)}
							width={item.image.width}
							height={item.image.height}
							alt={resolveLocalized(item.image.alt, locale)}
							class:dim={!near}
							style={`aspect-ratio: ${item.image.width} / ${item.image.height}`}
							loading={near ? 'eager' : 'lazy'}
							decoding="async"
						/>
					{:else}
						<img src={item.src} alt={cap ?? ''} loading="lazy" decoding="async" />
					{/if}
				</figure>

				<!-- Observation-log annotation card: only fields that truly exist. -->
				<div class="log">
					<p class="log-head">
						<span class="log-star" aria-hidden="true">{item.kind === 'video' ? '▸' : '✶'}</span>
						{m.eyepiece_plate()}
						{plateId(i)}
						{#if item.meta?.object}
							<span class="obj">— {resolveLocalized(item.meta.object, locale)}</span>
						{/if}
					</p>
					{#if item.meta?.radec}
						<p class="radec">{item.meta.radec}</p>
					{/if}
					{#if item.meta && (item.meta.location || item.meta.date || item.meta.gear || item.meta.exposure)}
						<dl class="rows">
							{#if item.meta.location}
								<div><dt>{m.meta_location()}</dt><dd>{resolveLocalized(item.meta.location, locale)}</dd></div>
							{/if}
							{#if item.meta.date}
								<div><dt>{m.meta_date()}</dt><dd>{formatDate(item.meta.date)}</dd></div>
							{/if}
							{#if item.meta.gear}
								<div><dt>{m.meta_gear()}</dt><dd>{item.meta.gear}</dd></div>
							{/if}
							{#if item.meta.exposure}
								<div><dt>{m.meta_exposure()}</dt><dd>{item.meta.exposure}</dd></div>
							{/if}
						</dl>
					{/if}
					{#if cap}<p class="cap">{cap}</p>{/if}
				</div>
			</section>
		{/each}
	</div>

	<footer class="deck">
		<button
			class="step"
			type="button"
			disabled={active === 0}
			onclick={() => goTo(active - 1)}
			aria-label={`${m.eyepiece_plate()} ${plateId(Math.max(active - 1, 0))}`}
		>
			<span aria-hidden="true">‹</span>
		</button>
		<div class="pager" role="group" aria-label={resolveLocalized(album.title, locale)}>
			{#each album.media as item, i (item.id)}
				<button
					class="dot"
					class:on={i === active}
					type="button"
					aria-label={`${m.eyepiece_plate()} ${plateId(i)}`}
					aria-current={i === active ? 'true' : undefined}
					onclick={() => goTo(i)}
				>
					<span class="dot-star" aria-hidden="true"></span>
				</button>
			{/each}
		</div>
		<button
			class="step"
			type="button"
			disabled={active === count - 1}
			onclick={() => goTo(active + 1)}
			aria-label={`${m.eyepiece_plate()} ${plateId(Math.min(active + 1, count - 1))}`}
		>
			<span aria-hidden="true">›</span>
		</button>
	</footer>

	<!-- Circular eyepiece vignette over the field, under the controls. -->
	<span class="vignette" aria-hidden="true"></span>
</dialog>

<style>
	dialog.eyepiece {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100dvh;
		max-width: none;
		max-height: none;
		margin: 0;
		padding: 0;
		border: 0;
		/* The eyepiece is deliberately near-black in every theme. */
		background: radial-gradient(140% 100% at 50% 42%, #0b0e18 0%, #04050a 58%, #000 100%);
		color: #dfe8f6;
	}
	dialog.eyepiece[open] {
		display: flex;
		flex-direction: column;
		animation: eye-in 200ms ease;
	}
	@keyframes eye-in {
		from {
			opacity: 0;
			transform: scale(0.985);
		}
	}
	dialog.eyepiece::backdrop {
		background: rgba(0, 0, 0, 0.75);
	}

	.vignette {
		position: absolute;
		inset: 0;
		z-index: 1;
		pointer-events: none;
		background: radial-gradient(115% 82% at 50% 45%, transparent 52%, rgba(0, 0, 0, 0.6) 100%);
	}

	/* ---- Top bar: plate counter + the one exit ----------------------------- */
	.bar {
		position: relative;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: calc(0.5rem + env(safe-area-inset-top)) 0.75rem 0.5rem;
	}
	.counter {
		margin: 0;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: var(--fs-small, 0.8rem);
		text-transform: uppercase;
		letter-spacing: 0.18em;
		color: color-mix(in srgb, #cfe6ff 78%, transparent);
	}
	.counter .mark {
		color: var(--accent, #7fd4ff);
	}
	.counter .of {
		color: color-mix(in srgb, #cfe6ff 45%, transparent);
	}
	.close {
		flex: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		min-width: 44px;
		min-height: 44px;
		padding: 0 0.7rem;
		border: 1px solid color-mix(in srgb, #cfe6ff 32%, transparent);
		background: rgba(6, 9, 16, 0.6);
		color: #dfe8f6;
		font: inherit;
		font-size: 0.95rem;
		cursor: pointer;
		transition: border-color 200ms ease;
	}
	.close:hover,
	.close:focus-visible {
		border-color: color-mix(in srgb, var(--accent, #7fd4ff) 85%, transparent);
	}
	.close-word {
		display: none;
		font-size: var(--fs-small, 0.8rem);
		text-transform: uppercase;
		letter-spacing: 0.16em;
	}

	/* ---- Scroll-snap track: one full-width slide per plate ------------------ */
	.track {
		position: relative;
		z-index: 0;
		flex: 1;
		min-height: 0;
		display: flex;
		overflow-x: auto;
		overflow-y: hidden;
		scroll-snap-type: x mandatory;
		overscroll-behavior-x: contain;
		scrollbar-width: none;
	}
	.track::-webkit-scrollbar {
		display: none;
	}
	.slide {
		flex: 0 0 100%;
		width: 100%;
		min-width: 100%;
		scroll-snap-align: start;
		scroll-snap-stop: always;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.9rem;
		padding: 0.35rem 1rem 1rem;
		overflow-y: auto;
	}

	.view {
		margin: 0;
		width: 100%;
		max-width: 62rem;
		display: grid;
		place-items: center;
	}
	.view img {
		display: block;
		width: auto;
		height: auto;
		max-width: 100%;
		max-height: 56vh;
		object-fit: contain;
		box-shadow: 0 0 60px rgba(0, 0, 0, 0.9);
	}
	.view img.dim {
		filter: brightness(0.45);
	}

	/* Video facade: nothing loads until this explicit tap. */
	.player {
		width: 100%;
		max-width: 52rem;
	}
	.facade {
		display: grid;
		place-items: center;
		gap: 0.8rem;
		width: min(100%, 32rem);
		aspect-ratio: 16 / 9;
		border: 1px solid color-mix(in srgb, #cfe6ff 30%, transparent);
		background:
			radial-gradient(60% 80% at 50% 35%, rgba(127, 212, 255, 0.08), transparent 70%),
			rgba(5, 8, 15, 0.85);
		color: #dfe8f6;
		font: inherit;
		cursor: pointer;
		transition: border-color 200ms ease;
	}
	.facade:hover,
	.facade:focus-visible {
		border-color: color-mix(in srgb, var(--accent, #7fd4ff) 85%, transparent);
	}
	.facade .tri {
		display: grid;
		place-items: center;
		width: 3.2rem;
		height: 3.2rem;
		border: 1px solid color-mix(in srgb, var(--accent, #7fd4ff) 75%, transparent);
		border-radius: 50%;
		font-size: 1.4rem;
		line-height: 1;
		padding-left: 0.2rem;
		color: var(--accent, #7fd4ff);
	}
	.facade-cap {
		font-size: var(--fs-small, 0.8rem);
		text-transform: uppercase;
		letter-spacing: 0.16em;
		color: color-mix(in srgb, #cfe6ff 70%, transparent);
	}

	/* ---- The annotation card: metadata as observation log ------------------- */
	.log {
		position: relative;
		width: min(100%, 34rem);
		padding: 0.85rem 1rem 0.9rem;
		border: 1px solid color-mix(in srgb, #cfe6ff 26%, transparent);
		background: rgba(8, 11, 20, 0.72);
	}
	.log::before,
	.log::after {
		content: '';
		position: absolute;
		width: 10px;
		height: 10px;
		border: 1px solid color-mix(in srgb, var(--accent, #7fd4ff) 85%, transparent);
		pointer-events: none;
	}
	.log::before {
		top: -1px;
		left: -1px;
		border-right: 0;
		border-bottom: 0;
	}
	.log::after {
		bottom: -1px;
		right: -1px;
		border-left: 0;
		border-top: 0;
	}
	.log-head {
		margin: 0;
		font-size: var(--fs-small, 0.8rem);
		text-transform: uppercase;
		letter-spacing: 0.18em;
		color: #dfe8f6;
	}
	.log-star {
		color: var(--accent, #7fd4ff);
	}
	.log-head .obj {
		color: color-mix(in srgb, #cfe6ff 85%, transparent);
	}
	.radec {
		margin: 0.35rem 0 0;
		font-size: var(--fs-small, 0.8rem);
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: color-mix(in srgb, #cfe6ff 55%, transparent);
	}
	.rows {
		margin: 0.6rem 0 0;
	}
	.rows div {
		display: flex;
		gap: 0.8rem;
		padding: 0.28rem 0;
		border-top: 1px dashed color-mix(in srgb, #cfe6ff 16%, transparent);
	}
	.rows dt {
		flex: 0 0 6.2rem;
		font-size: var(--fs-small, 0.8rem);
		text-transform: uppercase;
		letter-spacing: 0.16em;
		color: color-mix(in srgb, #cfe6ff 48%, transparent);
	}
	.rows dd {
		margin: 0;
		font-size: 0.92rem;
		line-height: 1.45;
		color: #dfe8f6;
	}
	.cap {
		margin: 0.6rem 0 0;
		font-size: 0.92rem;
		line-height: 1.5;
		color: color-mix(in srgb, #dfe8f6 88%, transparent);
	}

	/* ---- Star-dot pager + prev/next ---------------------------------------- */
	.deck {
		position: relative;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		padding: 0.3rem 0.75rem calc(0.45rem + env(safe-area-inset-bottom));
	}
	.pager {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.dot {
		display: grid;
		place-items: center;
		width: 2.25rem;
		height: 44px;
		padding: 0;
		border: 0;
		background: none;
		cursor: pointer;
	}
	.dot-star {
		position: relative;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #cfe6ff;
		opacity: 0.4;
		transition:
			opacity 200ms ease,
			transform 200ms ease;
	}
	.dot:hover .dot-star,
	.dot:focus-visible .dot-star {
		opacity: 0.85;
	}
	.dot.on .dot-star {
		opacity: 1;
		background: var(--accent, #7fd4ff);
		transform: scale(1.25);
		box-shadow: 0 0 8px 1px color-mix(in srgb, var(--accent, #7fd4ff) 65%, transparent);
	}
	/* 4-point glint cross on the current star. */
	.dot-star::before,
	.dot-star::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 50%;
		border-radius: 1px;
		background: var(--cosmos-glint, #ff8ad9);
		transform: translate(-50%, -50%) scale(0);
		transition: transform 200ms ease;
	}
	.dot-star::before {
		width: 1.5px;
		height: 16px;
	}
	.dot-star::after {
		width: 16px;
		height: 1.5px;
	}
	.dot.on .dot-star::before,
	.dot.on .dot-star::after {
		transform: translate(-50%, -50%) scale(1);
	}

	.step {
		display: none;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 1px solid color-mix(in srgb, #cfe6ff 32%, transparent);
		background: rgba(6, 9, 16, 0.6);
		color: #dfe8f6;
		font-size: 1.3rem;
		line-height: 1;
		cursor: pointer;
		transition: border-color 200ms ease;
	}
	.step:hover:not(:disabled),
	.step:focus-visible {
		border-color: color-mix(in srgb, var(--accent, #7fd4ff) 85%, transparent);
	}
	.step:disabled {
		opacity: 0.3;
		cursor: default;
	}

	/* ---- Wider screens ------------------------------------------------------ */
	@media (min-width: 720px) {
		.close-word {
			display: inline;
		}
		.step {
			display: grid;
		}
		.bar {
			padding-inline: 1.25rem;
		}
	}
	@media (min-width: 900px) {
		.slide {
			flex-direction: row;
			align-items: center;
			justify-content: center;
			gap: 2.25rem;
			padding-inline: 2rem;
		}
		.view {
			width: auto;
			max-width: min(60vw, 62rem);
		}
		.view img {
			max-height: 70vh;
		}
		.log {
			width: 22rem;
			flex: none;
		}
		.player,
		.facade {
			width: min(56vw, 52rem);
			max-width: none;
		}
	}

	/* ---- Reduced motion: instant everything --------------------------------- */
	@media (prefers-reduced-motion: reduce) {
		dialog.eyepiece[open] {
			animation: none;
		}
		.track {
			scroll-behavior: auto;
		}
		.dot-star,
		.dot-star::before,
		.dot-star::after,
		.close,
		.step,
		.facade {
			transition: none;
		}
	}
</style>
