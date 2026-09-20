/** Per-corner theming. Each top-level section maps to a theme: a CSS-variable
 *  palette (see themes.css) + a corner "scene" (see lib/scenes). */
export type ThemeName = 'garden' | 'water' | 'vaporwave' | 'cosmos';

const SECTION_THEME: Record<string, ThemeName> = {
	about: 'garden', // 🌲 forest / earth
	cv: 'water', // 💧 water
	projects: 'vaporwave', // 🌆 neon
	hobbies: 'cosmos' // 🌌 night sky
};

export const THEME_NAMES: ThemeName[] = ['garden', 'water', 'vaporwave', 'cosmos'];

/** Theme for a section id; falls back to garden. */
export function getThemeForSection(sectionId: string | null | undefined): ThemeName {
	return (sectionId && SECTION_THEME[sectionId]) || 'garden';
}

/** data-theme value for a section id — `hub` (neutral) when there's no section
 *  (the centered/home state), otherwise the section's theme. */
export function dataThemeForSection(sectionId: string | null | undefined): string {
	return sectionId ? getThemeForSection(sectionId) : 'hub';
}

/** The signature color each section paints its hub wedge with, so the centered
 *  wheel previews all four themes at once. */
export const SECTION_COLORS: Record<string, string> = {
	about: '#7fb08a', // garden
	cv: '#6cc3d6', // water
	projects: '#ff8ad9', // vaporwave
	hobbies: '#ff7a67' // cosmos
};

export function colorForSection(sectionId: string): string {
	return SECTION_COLORS[sectionId] ?? '#7f88a0';
}

/** Which themes currently melt the menu into their corner. */
export function themeHasMelt(theme: ThemeName): boolean {
	return theme === 'garden';
}
