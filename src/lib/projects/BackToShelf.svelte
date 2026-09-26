<script lang="ts">
	import { localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	let { slug }: { slug: string } = $props();
	const id = $derived(`back-remote-${slug}`);
</script>

<!-- One native link, one action. The SVG is the casing, not a set of tiny hit targets. -->
<a class="back-remote rewind" href={localizeHref(`/projects#tape-${slug}`)}>
	<svg
		class="remote-shell"
		viewBox="0 0 360 90"
		preserveAspectRatio="none"
		fill="none"
		aria-hidden="true"
	>
		<defs>
			<linearGradient id={`${id}-body`} x1="0" y1="0" x2="0.15" y2="1">
				<stop stop-color="#64636e" /><stop offset=".13" stop-color="#3e3d49" /><stop
					offset=".8"
					stop-color="#282733"
				/><stop offset="1" stop-color="#3d3948" />
			</linearGradient>
			<linearGradient id={`${id}-edge`}
				><stop stop-color="#94cfcc" /><stop offset="1" stop-color="#a972a0" /></linearGradient
			>
		</defs>
		<path
			d="M27 17H322Q347 17 350 36L354 65Q356 86 328 88H32Q5 88 7 66L10 38Q12 17 27 17Z"
			fill="#11121b"
			stroke="#17121f"
		/>
		<path
			d="M27 8H322Q347 8 350 29L354 59Q356 79 328 81H32Q5 81 7 59L10 30Q12 8 27 8Z"
			fill={`url(#${id}-body)`}
			stroke={`url(#${id}-edge)`}
		/>
		<path d="M29 13H321Q341 13 344 29" stroke="#dfd7eb" stroke-opacity=".25" />
		<path d="M16 65Q18 75 34 75H327" stroke="#080e19" stroke-opacity=".55" stroke-width="2" />
		<path d="M325 27v30m7-29v27m7-25v22" stroke="#10121c" stroke-opacity=".65" stroke-width="2" />
		<ellipse class="signal-light" cx="308" cy="22" rx="3" ry="2" fill="#749e99" />
	</svg>
	<span class="return-key" aria-hidden="true">
		<svg viewBox="0 0 24 24" fill="none"
			><path
				d="m10 6-6 6 6 6M4 12h16"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/></svg
		>
	</span>
	<span class="label">{m.projects_back()}</span>
</a>

<style>
	.back-remote {
		position: relative;
		isolation: isolate;
		display: inline-flex;
		align-items: center;
		gap: 0.85rem;
		width: fit-content;
		max-width: 100%;
		min-height: 80px;
		margin: 0 0 1.4rem;
		padding: 1rem 2.7rem 1.1rem 1.4rem;
		color: #f2e8d9;
		font: inherit;
		font-size: var(--fs-body);
		line-height: var(--lh-tight);
		text-decoration: none;
		transform: rotate(-2deg);
		filter: drop-shadow(0 7px 6px #0005);
		transition:
			transform 180ms,
			filter 180ms;
	}
	.remote-shell {
		position: absolute;
		inset: 0;
		z-index: -1;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
	.return-key {
		display: grid;
		place-items: center;
		flex: none;
		width: 44px;
		height: 40px;
		border: 1px solid #f4e5cc;
		border-radius: 7px;
		background: linear-gradient(#f5ead6, #c4b8a5);
		color: #302b3b;
		box-shadow:
			0 4px 0 #14111c,
			inset 0 1px 0 #fff9;
		transition:
			transform 180ms,
			box-shadow 180ms;
	}
	.return-key svg {
		width: 1.5rem;
		height: 1.5rem;
	}
	.label {
		max-width: 18ch;
	}
	.back-remote:hover {
		transform: rotate(0deg) translateY(-2px);
		filter: drop-shadow(0 9px 8px #0005);
	}
	.back-remote:hover .return-key {
		background: #f7ebd5;
	}
	.back-remote:hover .signal-light,
	.back-remote:focus-visible .signal-light {
		fill: #b0f3df;
	}
	.back-remote:active .return-key {
		transform: translateY(3px);
		box-shadow:
			0 1px 0 #14111c,
			inset 0 1px 0 #fff9;
	}
	.back-remote:focus-visible {
		outline: 3px solid var(--sub-bg);
		outline-offset: 5px;
		border-radius: 1.5rem;
	}
	@media (max-width: 40rem) {
		.back-remote {
			padding-inline: 1.2rem 2rem;
			gap: 0.7rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.back-remote,
		.return-key {
			transition: none;
		}
		.back-remote:hover {
			transform: rotate(-2deg);
		}
	}
</style>
