import { defineProjects, type Project } from './schema';

/** Creative / dev projects, grouped by `category` into the Projects section:
 *  #youtube, #opensource, #web. Edit / extend freely.
 *
 *  SAMPLE DATA: screenshots are generated stand-ins under /media/projects/…
 *  and the interactive embed points at a local mock build — both use the
 *  exact folder/field conventions the real assets (incl. Unity WebGL builds)
 *  will use later. */
export const projects: Project[] = defineProjects([
	{
		slug: 'my-channel',
		title: { en: 'My YouTube Channel', de: 'Mein YouTube-Kanal' },
		tagline: { en: 'Videos I make.', de: 'Videos, die ich mache.' },
		body: {
			en: 'Sample entry — the real channel description goes here.',
			de: 'Beispieleintrag — hier steht später die echte Kanalbeschreibung.'
		},
		tags: ['video'],
		year: 2026,
		category: 'youtube',
		featured: true,
		videos: [{ id: 'demo', title: 'Sample video', provider: 'youtube', src: 'dQw4w9WgXcQ' }]
	},
	{
		slug: 'lupe-webfolio',
		title: { en: 'Lupe Webfolio', de: 'Lupe Webfolio' },
		tagline: {
			en: 'This site — a radial-menu portfolio.',
			de: 'Diese Seite — ein Portfolio mit Radialmenü.'
		},
		body: {
			en: 'Open-source SvelteKit site built around a living radial menu. Four themed worlds, one wheel.',
			de: 'Quelloffene SvelteKit-Seite rund um ein lebendiges Radialmenü. Vier Themenwelten, ein Rad.'
		},
		tags: ['svelte', 'open-source'],
		year: 2026,
		category: 'opensource',
		stack: ['SvelteKit', 'Svelte 5', 'TypeScript', 'Zod', 'GSAP'],
		links: [{ label: 'Source', url: 'https://github.com/LuixBits/lupe-webfolio', rel: 'source' }]
	},
	{
		slug: 'scrumpoker',
		title: { en: 'Scrum Poker', de: 'Scrum Poker' },
		tagline: { en: 'A 3D planning-poker app.', de: 'Eine 3D-Planning-Poker-App.' },
		body: {
			en: 'Sample entry — what the app does, in one honest paragraph, goes here.',
			de: 'Beispieleintrag — was die App macht, in einem ehrlichen Absatz, steht später hier.'
		},
		tags: ['sveltekit', '3d'],
		year: 2025,
		category: 'web',
		stack: ['SvelteKit', 'Three.js', 'WebSocket'],
		screenshots: [1, 2, 3].map((n) => ({
			id: `screen-${n}`,
			image: {
				src: `/media/projects/scrumpoker/screen-0${n}-1600.webp`,
				thumb: `/media/projects/scrumpoker/screen-0${n}-480.webp`,
				width: 1600,
				height: 1000,
				alt: { en: 'Sample screenshot — to be replaced', de: 'Beispiel-Screenshot — wird ersetzt' }
			},
			caption: { en: `Sample screen ${n}`, de: `Beispielansicht ${n}` }
		})),
		demo: { url: 'https://scrumpoker.luizperren.dev' },
		links: [{ label: 'Live', url: 'https://scrumpoker.luizperren.dev', rel: 'demo' }]
	},
	{
		slug: 'orbit-toy',
		title: { en: 'Orbit Toy', de: 'Orbit Toy' },
		tagline: {
			en: 'A pointable particle cube — sample interactive build.',
			de: 'Ein drehbarer Partikelwürfel — interaktiver Beispiel-Build.'
		},
		body: {
			en: 'Sample entry demonstrating the embedded-build pipeline (the slot a Unity WebGL export plugs into).',
			de: 'Beispieleintrag für die Embed-Pipeline (der Platz, in den ein Unity-WebGL-Export kommt).'
		},
		tags: ['interactive'],
		year: 2026,
		category: 'web',
		stack: ['Canvas', 'Pointer Events'],
		demo: {
			embed: {
				kind: 'unity',
				src: '/media/projects/unity-mock/index.html',
				aspect: '16 / 9',
				title: { en: 'Orbit Toy — sample build', de: 'Orbit Toy — Beispiel-Build' }
			}
		}
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
