<script lang="ts">
	import { resolveLocalized, type Project } from '$lib/content/schema';
	import { localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import StudioGlimpse from './StudioGlimpse.svelte';
	let { project, locale }: { project: Project; locale: string } = $props();
	const id = $props.id();
</script>

<a
	class="studio-entrance"
	id={`tape-${project.slug}`}
	data-project-tape={project.slug}
	data-project-kind="studio"
	href={localizeHref(`/projects/${project.slug}`)}
>
	<svg class="door-frame" viewBox="0 0 420 570" preserveAspectRatio="none" aria-hidden="true">
		<defs>
			<linearGradient id={`${id}-frame`} x2="1" y2=".7"
				><stop stop-color="#c6acb9" /><stop offset=".15" stop-color="#574452" /><stop
					offset=".8"
					stop-color="#3a313f"
				/><stop offset="1" stop-color="#82616c" /></linearGradient
			>
		</defs>
		<path
			d="M2 568V2h416v566h-15V17H17v551Z"
			fill={`url(#${id}-frame)`}
			stroke="#c2a0ad"
			stroke-opacity=".3"
		/>
		<path d="M17 568V17H403V568" fill="none" stroke="#090f1c" stroke-width="6" />
		<path d="M18 564h384l16 5H2Z" fill="#b49b91" />
		<path d="M2 569h416" stroke="#3b3037" stroke-width="3" />
		<path d="M41 564h31m68 1h117m44 1h52" stroke="#ded1bc" stroke-opacity=".6" />
		<g class="door-panel" data-door-panel>
			<path d="M14 18 39 36V548L14 566Z" fill="#413546" stroke="#a28f9f" />
			<path d="M20 39 33 49V539l-13 10Z" fill="none" stroke="#716373" />
			<path d="M16 98v24m0 311v24" stroke="#c4b7a6" stroke-width="5" />
			<path d="M31 290v17m0-13-12-4" stroke="#17141f" stroke-width="5" stroke-linecap="round" />
			<path d="M31 289v15m0-12-12-4" stroke="#c3b59f" stroke-width="2" stroke-linecap="round" />
		</g>
	</svg>
	<div class="entrance-copy">
		<h3>{resolveLocalized(project.title, locale)}</h3>
		<p>{resolveLocalized(project.tagline, locale)}</p>
	</div>
	<div class="aperture" data-project-aperture aria-hidden="true"><StudioGlimpse /></div>
	<span class="action">{m.projects_enter_studio()} <span aria-hidden="true">→</span></span>
</a>

<style>
	.studio-entrance {
		position: relative;
		isolation: isolate;
		display: flex;
		flex-direction: column;
		min-height: 36.5rem;
		flex: 1;
		padding: 2rem 1.8rem 1.65rem max(3.2rem, 11%);
		color: var(--fg);
		text-decoration: none;
		background:
			radial-gradient(ellipse at 75% 65%, #72534255, transparent 60%),
			linear-gradient(125deg, #242a37, #292333 60%, #322633);
		box-shadow:
			8px 6px 0 #17131e,
			12px 14px 25px #0e0d1766,
			inset 0 0 30px #080f19;
		scroll-margin-top: 2rem;
	}
	.door-frame {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
	.studio-entrance::before {
		content: '';
		position: absolute;
		z-index: -1;
		inset: -3rem -2rem -1rem;
		background: radial-gradient(ellipse at 48% 55%, #73d9df2b, #73d9df0d 50%, transparent 72%);
		pointer-events: none;
		transition: opacity 220ms;
		opacity: 0.55;
	}
	.door-panel {
		transform-origin: 14px 285px;
		transition: transform 220ms ease;
	}
	.studio-entrance:focus-visible .door-panel {
		transform: scaleX(0.72);
	}
	@media (hover: hover) {
		.studio-entrance:hover .door-panel {
			transform: scaleX(0.72);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.door-panel {
			transition: none;
		}
		.studio-entrance:hover .door-panel,
		.studio-entrance:focus-visible .door-panel {
			transform: none;
		}
	}
	.entrance-copy h3 {
		overflow-wrap: anywhere;
		font-size: var(--fs-h2);
		margin: 0 0 0.5rem;
	}
	.entrance-copy p {
		overflow-wrap: anywhere;
		font-size: var(--fs-body);
		color: var(--fg-muted);
		margin: 0;
	}
	.aperture {
		min-height: 12rem;
		flex: 1;
		margin: 0.5rem -0.85rem;
		display: grid;
		align-items: center;
	}
	.action {
		overflow-wrap: anywhere;
		font-size: var(--fs-body);
		color: #c5f4ee;
		text-decoration: underline;
		text-underline-offset: 0.35em;
	}
	.studio-entrance:focus-visible::before {
		opacity: 1;
	}
	@media (hover: hover) {
		.studio-entrance:hover::before {
			opacity: 1;
		}
	}
	.studio-entrance:focus-visible {
		outline: 3px solid var(--sub-bg);
		outline-offset: 6px;
	}
	@media (max-width: 70rem) {
		.studio-entrance {
			min-height: 24rem;
		}
		.aperture {
			height: 13.5rem;
			min-height: 0;
			flex: none;
		}
	}
	@media (max-width: 40rem) {
		.studio-entrance {
			padding: 24px 20px 24px 38px;
		}
		.studio-entrance::before {
			inset-inline: -0.5rem;
		}
	}
	@container (max-width: 62rem) {
		.studio-entrance {
			min-height: 0;
		}
		.aperture {
			height: 13.5rem;
			min-height: 0;
			flex: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.studio-entrance::before {
			transition: none;
		}
	}
</style>
