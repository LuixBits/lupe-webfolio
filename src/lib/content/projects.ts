import { defineProjects, type Project } from './schema';

/** Creative / dev projects, grouped by `category` into the Projects section:
 *  #youtube, #opensource, #web. Edit / extend freely. */
export const projects: Project[] = defineProjects([
	{
		slug: 'my-channel',
		title: { en: 'My YouTube Channel', de: 'Mein YouTube-Kanal' },
		tagline: { en: 'Videos I make.', de: 'Videos, die ich mache.' },
		body: { en: 'A placeholder for a video project.', de: 'Ein Platzhalter für ein Videoprojekt.' },
		tags: ['video'],
		year: 2026,
		category: 'youtube',
		featured: true,
		videos: [{ id: 'demo', title: 'Latest video', provider: 'youtube', src: 'dQw4w9WgXcQ' }]
	},
	{
		slug: 'lupe-webfolio',
		title: { en: 'Lupe Webfolio', de: 'Lupe Webfolio' },
		tagline: {
			en: 'This site — a radial-menu portfolio.',
			de: 'Diese Seite — ein Portfolio mit Radialmenü.'
		},
		body: {
			en: 'Open-source SvelteKit site built around a living radial menu.',
			de: 'Quelloffene SvelteKit-Seite rund um ein lebendiges Radialmenü.'
		},
		tags: ['svelte', 'open-source'],
		year: 2026,
		category: 'opensource',
		links: [{ label: 'Source', url: 'https://github.com/LuixBits/lupe-webfolio', rel: 'source' }]
	},
	{
		slug: 'scrumpoker',
		title: { en: 'Scrum Poker', de: 'Scrum Poker' },
		tagline: { en: 'A 3D planning-poker app.', de: 'Eine 3D-Planning-Poker-App.' },
		body: { en: 'A web app placeholder.', de: 'Ein Platzhalter für eine Web-App.' },
		tags: ['sveltekit', '3d'],
		year: 2025,
		category: 'web',
		links: [{ label: 'Live', url: 'https://scrumpoker.luizperren.dev', rel: 'demo' }]
	}
]);

export const projectCategories = [
	{ id: 'youtube', anchor: 'youtube' },
	{ id: 'opensource', anchor: 'opensource' },
	{ id: 'web', anchor: 'web' }
] as const;

export function projectsByCategory(category: Project['category']): Project[] {
	return projects.filter((p) => p.category === category);
}

export function getProject(slug: string): Project | undefined {
	return projects.find((p) => p.slug === slug);
}
