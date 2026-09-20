<script lang="ts">
	import { resolveLocalized, type Project } from './schema';
	import { getLocale } from '$lib/paraglide/runtime';

	let { projects, base }: { projects: Project[]; base: string } = $props();
	const locale = getLocale();
</script>

<ul class="grid">
	{#each projects as p (p.slug)}
		<li>
			<a href="{base}/{p.slug}">
				<h3>{resolveLocalized(p.title, locale)}</h3>
				<p>{resolveLocalized(p.tagline, locale)}</p>
				<div class="tags">
					<span class="year">{p.year}</span>
					{#each p.tags as t (t)}<span class="tag">{t}</span>{/each}
				</div>
			</a>
		</li>
	{/each}
</ul>

<style>
	.grid {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
	}
	a {
		display: block;
		height: 100%;
		padding: 1rem 1.1rem;
		border: 1px solid color-mix(in srgb, var(--slice-bg) 55%, transparent);
		border-radius: 12px;
		background: color-mix(in srgb, var(--slice-bg) 14%, transparent);
		color: inherit;
		text-decoration: none;
		transition:
			transform 0.15s ease,
			border-color 0.15s ease;
	}
	a:hover,
	a:focus-visible {
		transform: translateY(-2px);
		border-color: var(--accent);
		outline: none;
	}
	h3 {
		margin: 0 0 0.25rem;
	}
	p {
		margin: 0 0 0.75rem;
		color: var(--fg-muted);
	}
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		font-size: 0.75rem;
	}
	.tag,
	.year {
		padding: 0.1rem 0.5rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--slice-bg) 30%, transparent);
	}
	.year {
		font-weight: 600;
	}
</style>
