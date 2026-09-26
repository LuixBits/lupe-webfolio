<script lang="ts">
	import type { Project } from '$lib/content/schema';
	let { project }: { project: Project } = $props();
</script>

<svg viewBox="0 0 70 70" fill="none" aria-hidden="true">
	{#if project.channel?.avatar}
		<image href={project.channel.avatar.src} x="2" y="2" width="66" height="66" />
		<rect x="1" y="1" width="68" height="68" rx="2" stroke="currentColor" opacity="0.5" />
	{:else if project.category === 'youtube'}
		<rect x="9" y="18" width="52" height="38" rx="8" stroke="currentColor" stroke-width="2" />
		<path d="M29 28L45 37L29 46Z" fill="currentColor" /><path
			d="M24 6l12 12L48 6"
			stroke="currentColor"
			stroke-width="2"
		/>
	{:else if project.category === 'opensource'}
		<circle cx="35" cy="35" r="27" stroke="currentColor" /><circle
			cx="35"
			cy="35"
			r="17"
			stroke="currentColor"
		/><circle cx="35" cy="35" r="6" fill="currentColor" />
		<path
			d="M35 8v21m0 12v21M8 35h21m12 0h21M16 16l15 15m9 9 14 14M54 16L39 31M16 54l15-15"
			stroke="currentColor"
		/>
	{:else if project.demo?.embed}
		<ellipse
			cx="35"
			cy="35"
			rx="31"
			ry="12"
			stroke="currentColor"
			transform="rotate(-35 35 35)"
		/><ellipse cx="35" cy="35" rx="31" ry="12" stroke="currentColor" transform="rotate(45 35 35)" />
		<path d="M35 22l12 7v14l-12 7-12-7V29ZM23 29l12 7 12-7m-12 7v14" stroke="currentColor" /><circle
			cx="59"
			cy="17"
			r="3"
			fill="currentColor"
		/>
	{:else}
		<rect x="9" y="13" width="52" height="43" rx="4" stroke="currentColor" /><path
			d="M9 23h52M19 18h2m4 0h2m4 0h2M29 32l-9 7 9 7m12-14 9 7-9 7M38 30l-7 18"
			stroke="currentColor"
			stroke-width="1.5"
		/>
	{/if}
</svg>

<style>
	svg {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
