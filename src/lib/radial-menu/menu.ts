import * as m from '$lib/paraglide/messages';
import type { MenuItem } from './types';

/** The site's navigation, described once. Labels are Paraglide message getters,
 *  so the menu updates live when the locale changes. Keep ids stable — they
 *  seed each section's garden and drive dock/route state.
 *
 *  Array order = wedge position (slice 0 top-right, 1 bottom-right, 2 bottom-
 *  left, 3 top-left). So this order places: About top-left, Projects top-right,
 *  Hobbies bottom-left, CV bottom-right — matching the hub backdrop squares. */
export const menu: MenuItem[] = [
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
		id: 'cv',
		label: m.nav_cv,
		href: '/cv',
		children: [
			{ id: 'cv-research', label: m.nav_cv_research, href: '/cv#research' },
			{ id: 'cv-publications', label: m.nav_cv_publications, href: '/cv#publications' }
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
	},
	{
		id: 'about',
		label: m.nav_about,
		href: '/about',
		children: [
			{ id: 'about-bio', label: m.nav_about_bio, href: '/about#bio' },
			{ id: 'about-contact', label: m.nav_about_contact, href: '/about#contact' }
		]
	}
];

/** The top-level section id a path belongs to (null = home/hub). Longest-prefix
 *  match, so /projects/alpha resolves to `projects`. */
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
