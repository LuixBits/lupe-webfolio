<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import PondScene from '$lib/water/pond/PondScene.svelte';

	/* »Der Anlegesteg« — the whole CV as one pond at dawn. Work floats,
	 * education grows; time is distance to the far gate; every craft is a
	 * doorway (/cv/<slug> — the Logbuch aboard). The scene carries the page;
	 * this file is only the sky the title hangs in. */
</script>

<svelte:head>
	<title>{m.nav_cv()} — Lupe</title>
	<meta name="description" content={m.meta_desc_cv()} />
</svelte:head>

<div class="moor">
	<header class="page moor-head">
		<p class="eyebrow">{m.cv_eyebrow()}</p>
		<h1>{m.nav_cv()}</h1>
		<p class="lead">{m.cv_lead()}</p>
	</header>

	<div class="pond-bleed">
		<PondScene />
	</div>
</div>

<style>
	/* one warm dawn from the title down into the scene's sky — the wrapper
	   full-bleeds behind main's padding so no cool app band interrupts it */
	.moor {
		position: relative;
	}
	.moor::before {
		content: '';
		position: absolute;
		top: -2.5rem;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 100vw;
		background: #f4efe2;
		z-index: -1;
	}
	.moor-head {
		padding-top: 6.5rem;
		padding-bottom: 0.5rem;
	}
	.moor-head h1 {
		margin-bottom: 0.75rem;
		/* keep the title clear of the top-left docked wheel */
		margin-left: clamp(0rem, calc(17rem - 50vw + 50%), 17rem);
	}
	.moor-head .eyebrow {
		margin-left: clamp(0rem, calc(17rem - 50vw + 50%), 17rem);
	}
	.moor-head .lead {
		margin: 0;
		max-width: 34rem;
		margin-left: clamp(0rem, calc(17rem - 50vw + 50%), 17rem);
	}
	.pond-bleed {
		position: relative;
		left: 50%;
		transform: translateX(-50%);
		width: 100vw;
		margin-top: 0.75rem;
		margin-bottom: -2rem;
	}
	@media (max-width: 560px) {
		.moor-head {
			padding-top: 5rem;
		}
		.moor-head h1,
		.moor-head .eyebrow,
		.moor-head .lead {
			margin-left: 0;
		}
		.moor-head {
			padding-top: calc(min(86vw, 400px) * 0.42 + 3rem);
		}
	}
</style>
