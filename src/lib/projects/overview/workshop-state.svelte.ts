import { getContext } from 'svelte';
export const workshopRoom = Symbol('workshop-room');
// A new object per Projects layout, never shared between SSR requests.
export function createWorkshopState() {
	const room = $state({ lampOn: true, paused: false, catAwake: false, drawerOpen: false });
	return room;
}
export function useWorkshopState() {
	return getContext<ReturnType<typeof createWorkshopState>>(workshopRoom);
}
/** Ambient zones sleep outside the viewport. */
export function roomActivity(node: HTMLElement) {
	const observer = new IntersectionObserver(([entry]) => {
		node.dataset.visible = String(entry.isIntersecting);
	});
	observer.observe(node);
	return { destroy: () => observer.disconnect() };
}
