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
		title: { en: 'LuixBits', de: 'LuixBits' },
		tagline: {
			en: 'Linux, NixOS & things I build.',
			de: 'Linux, NixOS & meine eigenen Projekte.'
		},
		body: {
			en: 'On LuixBits, I document what I do with Linux, NixOS and the tools around them. I build and configure things, explain how they work, and show the setup on screen.\n\nThat can mean breaking NixOS on purpose to test its recovery, building a floor planner inside Neovim, or using a Casio watch to control my desktop. There are practical walkthroughs alongside experiments and small open-source projects.',
			de: 'Auf LuixBits dokumentiere ich, was ich mit Linux, NixOS und den Werkzeugen drumherum mache. Ich baue und konfiguriere Dinge, erkläre, wie sie funktionieren, und zeige das Setup direkt am Bildschirm.\n\nDafür mache ich auch mal NixOS absichtlich kaputt, um die Wiederherstellung zu testen, baue einen Grundrissplaner in Neovim oder steuere meinen Desktop mit einer Casio-Uhr. Neben praktischen Anleitungen gibt es Experimente und kleine Open-Source-Projekte.'
		},
		tags: ['Linux', 'NixOS', 'Neovim', 'open source'],
		year: 2026,
		category: 'youtube',
		featured: true,
		channel: {
			handle: '@LuixBits',
			url: 'https://www.youtube.com/@LuixBits',
			avatar: {
				src: '/media/projects/luixbits/avatar.jpg',
				width: 240,
				height: 240,
				alt: { en: 'LuixBits channel avatar', de: 'LuixBits-Kanalbild' }
			}
		},
		links: [
			{ label: 'YouTube · @LuixBits', url: 'https://www.youtube.com/@LuixBits', rel: 'external' }
		],
		// Public uploads and durations verified against the channel on 2026-09-26.
		videos: [
			{
				id: 'nix-flakes',
				title: 'What Is a Nix Flake? (And How to Use It)',
				provider: 'youtube',
				src: 'gn3h4x6_678',
				poster: '/media/projects/luixbits/flakes.jpg',
				duration: 636
			},
			{
				id: 'nixos-recovery',
				title: 'I Broke NixOS on Purpose and Fixed It in 40 Seconds',
				provider: 'youtube',
				src: 'YPBpWC6BpMQ',
				poster: '/media/projects/luixbits/recovery.jpg',
				duration: 828
			},
			{
				id: 'neovim-floor-planner',
				title: 'I built a floor planner in Neovim',
				provider: 'youtube',
				src: 'bAPyriQQsNM',
				poster: '/media/projects/luixbits/roomplanner.jpg',
				duration: 789
			},
			{
				id: 'casio-nixos',
				title: 'My Casio Watch Controls NixOS Now || Noctalia Plugin',
				provider: 'youtube',
				src: 'SYBy4kMvbhY',
				poster: '/media/projects/luixbits/casio.jpg',
				duration: 597
			}
		]
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
