/** Shared by the persistent Projects layout, room light and CRT reveal. */
export const projectNavigation = Symbol('project-navigation');
export type ProjectNavigation = { readonly moving: boolean };

export function projectTiming(compact: boolean, returning: boolean, studio: boolean) {
	if (returning) return { duration: compact ? 260 : 420, arrival: compact ? 260 : 420, delay: 0 };
	if (compact) return { duration: 360, arrival: 280, delay: 80 };
	return studio
		? { duration: 640, arrival: 470, delay: 170 }
		: { duration: 460, arrival: 340, delay: 120 };
}

// Paraglide changes locale with a full reload. Carry only this one-shot visual
// preference across it; direct visits and subsequent reloads still reveal once.
const localeRevealKey = 'projects-locale-reveal';
export function markProjectLocaleChange() {
	try {
		sessionStorage.setItem(localeRevealKey, String(Date.now()));
	} catch {
		/* Storage is optional. */
	}
}
export function consumeProjectLocaleChange() {
	try {
		const timestamp = Number(sessionStorage.getItem(localeRevealKey));
		sessionStorage.removeItem(localeRevealKey);
		return timestamp > 0 && Date.now() - timestamp < 30_000;
	} catch {
		return false;
	}
}
