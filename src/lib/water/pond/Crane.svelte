<script lang="ts">
	/** The folded origami crane (senbazuru — healing), shared by the Armee
	 *  vessel and its logbook slip. Local coords ≈ 66×46, feet at y≈42.
	 *  Deliberately NOT a red cross (protected emblem). */
	let { s = 1 }: { s?: number } = $props();
</script>

<g transform="scale({s})" aria-hidden="true">
	<path class="cr-wing" d="M29 3 L45 28 L15 27 Z" />
	<path class="cr-body" d="M8 34 L30 23 L53 29 L37 42 L15 40 Z" />
	<path class="cr-fold" d="M30 23 L37 42" />
	<path class="cr-body" d="M8 34 L3 15 L7 14 L13 30 Z" />
	<path class="cr-beak" d="M3.6 15.4 L0 18.5 L5 19 Z" />
	<path class="cr-tail" d="M53 29 L63 21 L56 33 Z" />
</g>

<style>
	.cr-wing {
		fill: #fbf6e8;
		stroke: rgba(44, 36, 27, 0.45);
		stroke-width: 1;
		stroke-linejoin: round;
	}
	.cr-body,
	.cr-tail {
		fill: #f1e8d2;
		stroke: rgba(44, 36, 27, 0.45);
		stroke-width: 1;
		stroke-linejoin: round;
	}
	.cr-beak {
		fill: #c43f2a;
	}
	.cr-fold {
		fill: none;
		stroke: rgba(44, 36, 27, 0.3);
		stroke-width: 0.8;
	}
</style>
