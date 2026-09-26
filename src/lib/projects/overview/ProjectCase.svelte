<script lang="ts">
	import { resolveLocalized, type Project } from '$lib/content/schema';
	import { localizeHref } from '$lib/paraglide/runtime';
	import ProjectCover from './ProjectCover.svelte';
	let { project, locale }: { project: Project; locale: string } = $props();
</script>

<a
	class="project-case"
	id={`tape-${project.slug}`}
	data-project-tape={project.slug}
	data-project-kind="case"
	class:portfolio={project.slug === 'lupe-webfolio'}
	class:poker={project.slug === 'scrumpoker'}
	href={localizeHref(`/projects/${project.slug}`)}
>
	<span class="cover" aria-hidden="true"><ProjectCover {project} /></span>
	<div class="paper-label">
		<h3>{resolveLocalized(project.title, locale)}</h3>
		<p>{resolveLocalized(project.tagline, locale)}</p>
	</div>
</a>

<style>
	.project-case {
		position: relative;
		isolation: isolate;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		padding: 1.1rem 1rem 1rem 1.3rem;
		background: linear-gradient(115deg, #45404c, #2b2935 65%, #322836);
		border: 1px solid #877483;
		border-radius: 4px 6px 4px 2px;
		box-shadow:
			5px 3px 0 #151522,
			8px 9px 10px #0a0b1466,
			inset 1px 1px 0 #dfcddd33;
		color: #332b3b;
		text-decoration: none;
		scroll-margin-top: 2rem;
		transition:
			transform 200ms ease,
			border-color 200ms ease,
			box-shadow 200ms ease;
	}
	.project-case::before {
		content: '';
		position: absolute;
		inset: 3px auto 3px 4px;
		width: 6px;
		background: repeating-linear-gradient(#63616c 0 1px, #232330 1px 5px);
		border-right: 1px solid #110e1b;
		pointer-events: none;
	}
	.project-case::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		border-radius: inherit;
		pointer-events: none;
		background: radial-gradient(ellipse at 0 60%, #6abac92e, transparent 65%);
	}
	.cover {
		display: block;
		flex: none;
		width: 100%;
		height: auto;
		aspect-ratio: 16 / 9;
		color: #8de4dd;
		padding: 0;
		border: 1px solid #7c778680;
		background: radial-gradient(ellipse at 50% 100%, #415564, #191c2a 75%);
		box-shadow: 1px 2px 2px #0e111a;
		transform: rotate(-1.5deg);
	}
	.poker .cover {
		background: linear-gradient(135deg, #523448, #261b2c);
	}
	.portfolio .cover {
		color: #a5e8df;
	}
	.paper-label {
		min-width: 0;
		flex: 1;
		padding: 0.7rem 0.8rem;
		background: linear-gradient(108deg, #f0e6d0, #e6d8be);
		border: 1px solid #fff2d688;
		box-shadow: 0 2px 3px #0c0c1833;
	}
	.paper-label h3 {
		overflow-wrap: anywhere;
		margin: 0 0 0.35rem;
		font-size: var(--fs-h3);
	}
	.paper-label p {
		margin: 0;
		font-size: var(--fs-body);
		line-height: 1.5;
		overflow-wrap: anywhere;
	}
	.project-case:focus-visible {
		outline: 3px solid var(--sub-bg);
		outline-offset: 5px;
	}
	@media (hover: hover) {
		.project-case:hover {
			border-color: #abdedb;
			box-shadow:
				5px 6px 0 #151522,
				9px 14px 17px #0a0b1480,
				inset 1px 1px 0 #dfcddd33;
		}
	}
	@media (prefers-reduced-motion: no-preference) {
		.project-case:focus-visible {
			transform: translateY(-5px) rotate(-0.5deg);
		}
		@media (hover: hover) {
			.project-case:hover {
				transform: translateY(-5px) rotate(-0.5deg);
			}
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.project-case {
			transition: none;
		}
	}
	@container (min-width: 36rem) {
		.portfolio .cover {
			width: 42%;
		}
		.portfolio {
			flex-direction: row;
			align-items: center;
		}
	}
	@media (max-width: 40rem) {
		.project-case {
			flex-direction: row;
			flex-wrap: wrap;
			align-items: center;
			padding: 13px 11px 11px 16px;
		}
		.cover {
			width: 100%;
			max-height: 9rem;
			height: auto;
		}
		.paper-label {
			flex-basis: 11rem;
			padding: 11px 13px;
		}
	}
</style>
