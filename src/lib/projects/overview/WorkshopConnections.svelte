<script lang="ts">
	import { onMount } from 'svelte';
	let node: SVGSVGElement;
	let width = $state(1440),
		height = $state(2800);
	let cable = $state('M32 35V1250Q32 1280 62 1280H1100V1320');
	onMount(() => {
		const room = node.closest<HTMLElement>('.workshop-overview')!;
		let frame = 0;
		const measure = () => {
			frame = 0;
			const bounds = room.getBoundingClientRect();
			const bench = room.querySelector('[data-workshop="bench"]')?.getBoundingClientRect();
			const lamp = room.querySelector('[data-workshop="lamp"]')?.getBoundingClientRect();
			width = bounds.width;
			height = bounds.height;
			if (bench && lamp) {
				const x = Math.max(14, Math.min(34, width * 0.022));
				const y = bench.top - bounds.top + 8;
				const endX = lamp.left - bounds.left + lamp.width * 0.54;
				const endY = lamp.top - bounds.top + 16;
				cable = `M${x} 35V${y - 24}Q${x} ${y} ${x + 24} ${y}H${endX}V${endY}`;
			}
		};
		const schedule = () => {
			if (!frame) frame = requestAnimationFrame(measure);
		};
		const observer = new ResizeObserver(schedule);
		observer.observe(room);
		room.querySelectorAll<HTMLElement>('[data-workshop]').forEach((el) => observer.observe(el));
		schedule();
		return () => {
			observer.disconnect();
			cancelAnimationFrame(frame);
		};
	});
</script>

<svg
	bind:this={node}
	class="conduit"
	viewBox={`0 0 ${width} ${height}`}
	preserveAspectRatio="none"
	fill="none"
	aria-hidden="true"
>
	<path d={cable} stroke="#141923" stroke-width="11" /><path
		d={cable}
		stroke="#867477"
		stroke-width="2"
	/>
</svg>
