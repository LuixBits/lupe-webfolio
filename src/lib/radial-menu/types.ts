/** A single node in the radial menu. Labels are i18n message getters so the
 *  menu re-renders correctly when the locale changes. */
export interface MenuItem {
	/** Stable id, used for keys, routing state and deterministic garden seeds. */
	id: string;
	/** Message getter (Paraglide compiles one function per message). */
	label: () => string;
	/** SvelteKit route. Omit for a pure parent that only opens a submenu. */
	href?: string;
	/** Optional inline SVG path for an icon rendered at the slice centroid. */
	icon?: string;
	children?: MenuItem[];
}

/** Where the menu currently lives on screen. `hub` = centered hero state. */
export type DockPosition = 'hub' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

/** Precomputed geometry for one rendered slice. */
export interface Slice {
	item: MenuItem;
	index: number;
	startAngle: number;
	endAngle: number;
	midAngle: number;
	path: string;
	centroid: { x: number; y: number };
}
