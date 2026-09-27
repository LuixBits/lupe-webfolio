<script lang="ts">
	/** Deck variant A — the open LOGBUCH: instead of stacked cards, one
	 *  believable object. A leather-bound log lies open on dock planks;
	 *  every station is a written entry on its own page — role as heading,
	 *  the span in the margin row, a few first-person lines, skills as
	 *  tied-on paper tags, and a round harbor stamp. Two stations fill a
	 *  spread exactly (EFZ left, BM right). Entirely static print — the
	 *  reduced-motion story is the story. */
	import { resolveLocalized, resolveSpan, type Station, type Vessel } from '$lib/content/schema';
	import { getLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';

	let { vessel, stations }: { vessel: Vessel; stations: Station[] } = $props();
	const locale = getLocale();
</script>

<section class="log">
	<h2 class="log-tab">{m.cv_logbook()}</h2>
	<div class="log-desk">
		<div class="log-cover">
			<div class="log-book">
				{#each stations as s, i (s.id)}
					<article class="log-page" class:log-page--right={i % 2 === 1}>
						<p class="log-kicker">
							<span>{s.track === 'education' ? m.cv_education() : m.cv_positions()}</span>
							<span class="log-kicker-span">{resolveSpan(s.span, locale)}</span>
						</p>
						<h3 class="log-role">{resolveLocalized(s.role, locale)}</h3>
						{#if s.org !== vessel.org}<p class="log-org">{s.org}</p>{/if}
						{#if s.story}<p class="log-hand">{resolveLocalized(s.story, locale)}</p>{/if}
						{#if s.takeaway}
							<p class="log-take">
								<em>{m.cv_takeaway()}</em> — {resolveLocalized(s.takeaway, locale)}
							</p>
						{/if}
						{#if s.skills.length}
							<ul class="log-tags" aria-label={m.cv_skills()}>
								{#each s.skills as sk, j (j)}
									<li>{resolveLocalized(sk, locale)}</li>
								{/each}
							</ul>
						{/if}
						<p class="log-stamp" aria-hidden="true">
							<span>{m.cv_moored()}</span>
							<span class="log-stamp-yrs">{resolveSpan(s.span, locale)}</span>
						</p>
					</article>
				{/each}
				<i class="log-ribbon" aria-hidden="true"></i>
			</div>
		</div>
	</div>
</section>

<style>
	.log {
		--paper: #f7f1de;
		--ink: #2c241b;
		--ink-muted: #6b5f4d;
		--seal: #c43f2a;
		margin-top: 1.8rem;
	}
	/* the title as the book's leather index tab, not a page heading */
	.log-tab {
		display: inline-block;
		margin: 0 0 -0.1rem 1.4rem;
		padding: 0.32rem 1.1rem 0.5rem;
		font-size: 0.95rem;
		letter-spacing: 0.12em;
		color: #f0e2c0;
		background: #5c4527;
		border-radius: 8px 8px 0 0;
		box-shadow: inset 0 -6px 10px -8px rgba(0, 0, 0, 0.7);
	}

	/* the dock the book lies on */
	.log-desk {
		padding: clamp(0.9rem, 3.5vw, 2rem);
		border-radius: 12px 5px 12px 5px;
		background: repeating-linear-gradient(
			0deg,
			#533e2a 0 44px,
			#2a1d12 44px 46px,
			#4a3725 46px 90px,
			#2a1d12 90px 92px,
			#423122 92px 136px,
			#2a1d12 136px 138px
		);
		box-shadow:
			inset 0 2px 14px rgba(0, 0, 0, 0.45),
			0 22px 40px -28px rgba(4, 40, 52, 0.7);
	}
	.log-cover {
		padding: clamp(6px, 1.6vw, 10px);
		border-radius: 10px;
		background: linear-gradient(105deg, #5c4527, #4a3524 60%, #543e24);
		box-shadow: 0 14px 28px -16px rgba(0, 0, 0, 0.75);
	}
	.log-book {
		position: relative;
		display: grid;
		grid-template-columns: 1fr 1fr;
		border-radius: 5px;
		overflow: hidden;
	}

	.log-page {
		position: relative;
		padding: 1.35rem 1.4rem 1.25rem;
		color: var(--ink);
		/* ruled log paper */
		background:
			repeating-linear-gradient(
				0deg,
				transparent 0 25px,
				color-mix(in srgb, var(--ink) 5%, transparent) 25px 26px
			),
			var(--paper);
		/* page curl into the gutter */
		box-shadow: inset -22px 0 26px -24px rgba(44, 36, 27, 0.55);
	}
	.log-page--right {
		box-shadow: inset 22px 0 26px -24px rgba(44, 36, 27, 0.55);
	}

	.log-kicker {
		margin: 0 0 0.4rem;
		display: flex;
		justify-content: space-between;
		gap: 0.6rem;
		font-size: 0.64rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-muted);
	}
	.log-kicker-span {
		letter-spacing: 0.05em;
		font-variant-numeric: tabular-nums;
	}
	.log-role {
		margin: 0 0 0.15rem;
		font-size: var(--fs-h3);
		line-height: 1.25;
	}
	.log-org {
		margin: 0 0 0.7rem;
		font-family: var(--font-display);
		font-style: italic;
		font-size: 0.92rem;
		color: var(--ink-muted);
	}
	.log-hand {
		margin: 0 0 0.75rem;
		font:
			italic 1rem/1.62 var(--font-display, Georgia),
			serif;
	}
	.log-take {
		margin: 0 0 0.9rem;
		font-size: 0.86rem;
		line-height: 1.5;
		color: var(--ink-muted);
	}
	.log-take em {
		font-style: normal;
		font-weight: 700;
		color: var(--seal);
		letter-spacing: 0.04em;
	}

	.log-tags {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
		font-size: 0.75rem;
	}
	.log-tags li {
		display: inline-flex;
		align-items: center;
		gap: 0.34rem;
		padding: 0.14rem 0.55rem 0.14rem 0.42rem;
		background: color-mix(in srgb, var(--paper) 40%, white);
		border: 1px solid color-mix(in srgb, var(--ink) 22%, transparent);
		border-radius: 2px 7px 2px 7px;
		rotate: -1deg;
	}
	.log-tags li:nth-child(even) {
		rotate: 1.2deg;
		border-radius: 7px 2px 7px 2px;
	}
	.log-tags li::before {
		content: '';
		width: 0.42em;
		height: 0.42em;
		flex: none;
		border: 1.5px solid #8a6a42;
		border-radius: 50%;
	}

	/* the round harbor stamp, pressed a little carelessly */
	.log-stamp {
		width: 5.4rem;
		height: 5.4rem;
		margin: 1rem 0.2rem 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.1rem;
		text-align: center;
		text-transform: uppercase;
		font-size: 0.56rem;
		letter-spacing: 0.16em;
		color: var(--seal);
		border: 2px solid var(--seal);
		border-radius: 50%;
		box-shadow:
			inset 0 0 0 3.5px transparent,
			inset 0 0 0 4.5px color-mix(in srgb, var(--seal) 60%, transparent);
		rotate: -7deg;
		opacity: 0.82;
	}
	.log-stamp-yrs {
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.06em;
		font-size: 0.62rem;
	}

	/* the rope bookmark over the gutter */
	.log-ribbon {
		position: absolute;
		top: 0;
		left: 50%;
		width: 9px;
		height: 34%;
		translate: -50% 0;
		background: linear-gradient(180deg, #c9a86a, #b3915a);
		clip-path: polygon(0 0, 100% 0, 100% 92%, 50% 100%, 0 92%);
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
	}

	@media (max-width: 640px) {
		.log-book {
			grid-template-columns: 1fr;
		}
		.log-page,
		.log-page--right {
			box-shadow: inset 0 -18px 22px -20px rgba(44, 36, 27, 0.5);
		}
		.log-ribbon {
			left: auto;
			right: 0.55rem;
			translate: 0 0;
			height: 3.2rem;
		}
	}
</style>
