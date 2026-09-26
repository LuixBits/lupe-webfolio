<script lang="ts">
	/** The canonical seigaiha (overlapping fan-wave) tile: a 44×22 pattern of
	 *  concentric-ring fans, rows painted bottom-up so each row is occluded by
	 *  the row above — the classic scale look. Render inside an <svg>'s
	 *  <defs>, then paint with fill="url(#{pid})". Colors are themeable via
	 *  --sg-fill / --sg-line / --sg-line-op on any ancestor. */
	let { pid }: { pid: string } = $props();
</script>

<g id="{pid}-fan">
	<circle r="22" class="sg-fill" />
	<circle r="22" class="sg-ring" fill="none" />
	<circle r="16.5" class="sg-ring" fill="none" />
	<circle r="11" class="sg-ring" fill="none" />
	<circle r="5.5" class="sg-ring" fill="none" />
</g>
<pattern id={pid} width="44" height="22" patternUnits="userSpaceOnUse">
	<use href="#{pid}-fan" x="22" y="33" />
	<use href="#{pid}-fan" x="0" y="22" />
	<use href="#{pid}-fan" x="44" y="22" />
	<use href="#{pid}-fan" x="22" y="11" />
	<use href="#{pid}-fan" x="0" y="0" />
	<use href="#{pid}-fan" x="44" y="0" />
	<use href="#{pid}-fan" x="22" y="-11" />
</pattern>

<style>
	.sg-fill {
		fill: var(--sg-fill, color-mix(in srgb, var(--slice-bg, #6cc3d6) 30%, var(--bg, #e8f4f8)));
	}
	.sg-ring {
		stroke: var(--sg-line, var(--water-deep, #2b9cba));
		stroke-opacity: var(--sg-line-op, 0.5);
		stroke-width: 1.3;
	}
</style>
