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
				><stop stop-color="#ab8b99" /><stop offset=".15" stop-color="#574452" /><stop
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
		<path d="M8 91v25m0 319v25" stroke="#b6aea3" stroke-width="6" />
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
		min-height: 33rem;
		padding: 2rem 1.8rem 1.65rem;
		color: var(--fg);
		text-decoration: none;
		background: linear-gradient(125deg, #242432, #181b27 60%, #29212c);
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
	.entrance-copy h3 {
		font-size: var(--fs-h2);
		margin: 0 0 0.5rem;
	}
	.entrance-copy p {
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
			padding: 1.5rem 1.25rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.studio-entrance::before {
			transition: none;
		}
	}
</style>
