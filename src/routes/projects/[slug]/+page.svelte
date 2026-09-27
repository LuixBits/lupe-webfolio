<script lang="ts">
	// THE COUNTER TV — bespoke project detail for /projects: a CRT playback deck
	// on the rental counter plus the tape's printed sleeve sheet below/beside it.
	// (ProjectDetail.svelte remains untouched for the CV route.)
	import CounterTv from '$lib/projects/CounterTv.svelte';
	import ChannelPlayer from '$lib/projects/ChannelPlayer.svelte';
	import TapeJacket from '$lib/projects/TapeJacket.svelte';
	import BackToShelf from '$lib/projects/BackToShelf.svelte';
	import ProjectStatus from '$lib/projects/ProjectStatus.svelte';
	import { resolveLocalized } from '$lib/content/schema';
	import { getLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const locale = getLocale();

	const project = $derived(data.project);
	const title = $derived(resolveLocalized(project.title, locale));
	const tagline = $derived(resolveLocalized(project.tagline, locale));
	const body = $derived(resolveLocalized(project.body, locale));
	const hasMedia = $derived(
		Boolean(project.screenshots.length || project.videos.length || project.demo?.embed)
	);
	/* Sample marker: the authored base-locale body self-identifies stand-in
	   entries ("Sample entry — …"). Quiet note rendered on the sleeve; it
	   disappears the moment real copy replaces the sample text. */
	const isSample = $derived(
		project.status === 'sample' || /^sample/i.test(resolveLocalized(project.body, 'en'))
	);

	/* Lending card: authored links plus the demo URL (deduped by URL). */
	const cardLinks = $derived.by(() => {
		const rows = project.links.map((l) => ({ label: l.label, url: l.url, rel: l.rel }));
		const demoUrl = project.demo?.url;
		if (demoUrl && !rows.some((r) => r.url === demoUrl)) {
			rows.unshift({ label: m.tv_open_full(), url: demoUrl, rel: 'demo' });
		}
		return rows;
	});
</script>

<svelte:head>
	<title>{title} — {m.nav_projects()} — Lupe</title>
	<meta name="description" content={tagline} />
</svelte:head>

<article class="page vhs-detail" class:no-media={!hasMedia}>
	<BackToShelf slug={project.slug} />

	{#if project.channel}
		{#key project.slug}<ChannelPlayer {project} {locale} />{/key}
	{:else}
		<div class="counter">
			{#if hasMedia}
				<div class="deckcol">
					{#key project.slug}<CounterTv {project} {locale} />{/key}
				</div>
			{/if}

			<section class="sleeve">
				<header class="masthead">
					<div class="jacket"><TapeJacket {project} /></div>
					<div class="heading">
						<h1>{title}</h1>
						<p class="tagline">{tagline}</p>
						<ProjectStatus {project} />
					</div>
				</header>

				{#if isSample}
					<p class="sample">{m.tv_sample_note()}</p>
				{/if}

				<p class="synopsis">{body}</p>

				{#if project.stack.length}
					<p class="stack">{project.stack.join(' / ')}</p>
				{/if}

				{#if cardLinks.length}
					<ul class="card">
						{#each cardLinks as l (l.url + l.label)}
							<li>
								<a href={l.url} target="_blank" rel="noopener">
									<span class="lbl">{l.label}</span>
									<span class="ext" aria-hidden="true">↗</span>
								</a>
							</li>
						{/each}
					</ul>
				{/if}

				{#if project.sources.length}
					<ul class="card srcs">
						{#each project.sources as s (s.id)}
							<li>
								<a href={s.url} target="_blank" rel="noopener">
									<span class="lbl"
										>{s.title}{#if s.author}&nbsp;— {s.author}{/if}{#if s.year}&nbsp;({s.year}){/if}</span
									>
									<span class="ext" aria-hidden="true">↗</span>
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</section>
		</div>
	{/if}
</article>

<style>
	.page.vhs-detail {
		overflow-wrap: anywhere;
		max-width: 78rem;
		padding-bottom: 7.5rem;
	}
	.sleeve {
		container: sleeve / inline-size;
		margin-top: 2rem;
		padding: 1.3rem 1.2rem;
		border-radius: 4px;
		background: color-mix(in srgb, var(--hub-bg) 34%, transparent);
	}
	.masthead {
		display: flex;
		align-items: flex-start;
		gap: 1.35rem;
	}
	.jacket {
		width: 6.6rem;
		flex: none;
	}
	.heading {
		min-width: 0;
	}
	.masthead h1 {
		margin: 0 0 0.6rem;
		font-size: var(--fs-h1);
		text-shadow:
			-1px 0 0 var(--sub-bg),
			1px 0 0 var(--accent);
	}
	.tagline {
		margin: 0;
		font-size: var(--fs-body);
		line-height: var(--lh-body);
		color: var(--fg-muted);
	}
	.sample {
		margin: 1.2rem 0 0;
		color: var(--fg-muted);
		font-size: var(--fs-small);
	}
	.synopsis {
		margin: 1.5rem 0 0;
		font-size: var(--fs-body);
		line-height: var(--lh-body);
	}
	.stack {
		margin: 1.2rem 0 0;
		font-size: var(--fs-small);
		line-height: var(--lh-body);
		color: var(--fg-muted);
	}
	.card {
		list-style: none;
		margin: 1.5rem 0 0;
		padding: 0;
	}
	.card li {
		border-bottom: 1px solid color-mix(in srgb, var(--fg) 20%, transparent);
	}
	.card a {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
		min-height: 44px;
		padding: 0.75rem 0;
		font-size: var(--fs-body);
		text-decoration: none;
		color: var(--fg);
	}
	.card .ext {
		margin-left: auto;
	}
	.card a:hover .lbl {
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	.card a:focus-visible {
		outline: 2px solid var(--sub-bg);
		outline-offset: 4px;
	}
	.no-media .counter {
		display: block;
		max-width: 46rem;
		margin: 1.5rem auto 0;
	}
	.no-media .sleeve {
		padding: 2rem;
		border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
	}
	.no-media .jacket {
		width: 8rem;
	}
	@media (min-width: 65rem) {
		.counter {
			display: grid;
			grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
			gap: 2.5rem;
			align-items: center;
		}
		.deckcol {
			position: sticky;
			top: 5.5rem;
		}
		.sleeve {
			margin-top: 0;
		}
	}
	@container sleeve (max-width: 24rem) {
		.masthead {
			flex-direction: column;
		}
		.jacket {
			max-width: 100px;
		}
	}
	@media (max-width: 40rem) {
		.page.vhs-detail {
			padding-inline: 0;
		}
		.masthead {
			gap: 1rem;
		}
		.jacket,
		.no-media .jacket {
			width: 5.8rem;
		}
		.sleeve {
			padding: 1.2rem 0.8rem;
		}
		.no-media .sleeve {
			padding: 1.5rem 1rem;
		}
	}
</style>
