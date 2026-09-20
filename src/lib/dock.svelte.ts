import type { DockPosition } from './radial-menu/types';
import { getThemeForSection, type ThemeName } from './themes';

/** Shared menu state (runes module store). RadialMenu writes the docked corner
 *  and active section here; the layout's corner scene reads it. The theme
 *  palette itself is applied by the layout from the route (SSR-safe) — this
 *  store drives the interactive corner scene. */
class MenuState {
	corner = $state<DockPosition>('bottom-left');
	/** Active top-level section id, or null when centered (hub). */
	sectionId = $state<string | null>(null);

	themeName: ThemeName = $derived(getThemeForSection(this.sectionId));
	docked: boolean = $derived(this.sectionId !== null);
}

export const menuState = new MenuState();
