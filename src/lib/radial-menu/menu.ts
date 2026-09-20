import * as m from '$lib/paraglide/messages';
import type { MenuItem } from './types';

/** The site's navigation, described once. Labels are Paraglide message getters,
 *  so the menu updates live when the locale changes. Keep ids stable — they
 *  seed each section's garden and drive dock/route state.
 *
 *  Four sections, one per corner. Each child anchors to a section on its
 *  page, so docking a corner reveals that section's sub-segments. */
export const menu: MenuItem[] = [
	{
		id: 'about',
		label: m.nav_about,
		href: '/about',
		children: [
			{ id: 'about-bio', label: m.nav_about_bio, href: '/about#bio' },
			{ id: 'about-contact', label: m.nav_about_contact, href: '/about#contact' }
		]
	},
	{
		id: 'academia',
		label: m.nav_academia,
		href: '/academia',
		children: [
			{ id: 'academia-research', label: m.nav_academia_research, href: '/academia#research' },
			{
				id: 'academia-publications',
				label: m.nav_academia_publications,
				href: '/academia#publications'
			}
		]
	},
	{
		id: 'projects',
		label: m.nav_projects,
		href: '/projects',
		children: [
			{ id: 'projects-youtube', label: m.nav_projects_youtube, href: '/projects#youtube' },
			{ id: 'projects-opensource', label: m.nav_projects_opensource, href: '/projects#opensource' },
			{ id: 'projects-web', label: m.nav_projects_web, href: '/projects#web' }
		]
	},
	{
		id: 'hobbies',
		label: m.nav_hobbies,
		href: '/hobbies',
		children: [
			{ id: 'hobbies-astro', label: m.nav_hobbies_astro, href: '/hobbies#astrophotography' },
			{ id: 'hobbies-drone', label: m.nav_hobbies_drone, href: '/hobbies#drone' },
			{ id: 'hobbies-wildlife', label: m.nav_hobbies_wildlife, href: '/hobbies#wildlife' }
		]
	}
];

/** The top-level section id a path belongs to (null = home/hub). Longest-prefix
 *  match, so /projects/alpha resolves to `projects`. Drives both routing state
 *  in the menu and the route-derived theme in the layout. */
export function sectionIdForPath(path: string): string | null {
	let id: string | null = null;
	let bestLen = 0;
	for (const item of menu) {
		const href = item.href;
		if (!href || href === '/') continue;
		if (
			(path === href || path.startsWith(href + '/') || path.startsWith(href + '#')) &&
			href.length > bestLen
		) {
			bestLen = href.length;
			id = item.id;
		}
	}
	return id;
}
