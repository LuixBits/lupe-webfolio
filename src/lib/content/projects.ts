import { defineProjects, type Project } from './schema';

/** The studio plus Web, Neovim and Desktop workstations. Open source is a tag,
 *  not a competing category. Small sample experiments sit at the end of the bench.
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
			{ label: 'YouTube · @LuixBits', url: 'https://www.youtube.com/@LuixBits', rel: 'external' },
			{ label: 'GitHub · LuixBits', url: 'https://github.com/LuixBits', rel: 'source' }
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
		category: 'web',
		stack: ['SvelteKit', 'Svelte 5', 'TypeScript', 'Zod', 'GSAP'],
		links: [{ label: 'Source', url: 'https://github.com/LuixBits/lupe-webfolio', rel: 'source' }]
	},
	{
		slug: 'scrumpoker',
		title: { en: 'Scrum Poker', de: 'Scrum Poker' },
		tagline: { en: 'A 3D planning-poker app.', de: 'Eine 3D-Planning-Poker-App.' },
		body: {
			en: 'Scrum Poker is a 3D planning-poker app.\n\nThe images on this page are sample artwork; actual captures of the application will replace them.',
			de: 'Scrum Poker ist eine 3D-Planning-Poker-App.\n\nDie Bilder auf dieser Seite sind Beispielgrafiken. Echte Aufnahmen der Anwendung werden sie ersetzen.'
		},
		tags: ['sveltekit', '3d'],
		year: 2025,
		category: 'web',
		status: 'sample',
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
		category: 'experiments',
		status: 'sample',
		stack: ['Canvas', 'Pointer Events'],
		demo: {
			embed: {
				kind: 'unity',
				src: '/media/projects/unity-mock/index.html',
				aspect: '16 / 9',
				title: { en: 'Orbit Toy — sample build', de: 'Orbit Toy — Beispiel-Build' }
			}
		}
	},
	{
		slug: 'team-feed',
		title: { en: 'Team Feed', de: 'Team Feed' },
		tagline: {
			en: 'A shared feed for Confluence and Markdown updates.',
			de: 'Ein gemeinsamer Feed für Confluence- und Markdown-Updates.'
		},
		body: {
			en: 'Team Feed is an Atlassian app that brings Confluence documents and selected Markdown updates into a shared feed. Readers return to their saved place, and discussions stay beneath each post.\n\nThe app lives inside Confluence as a page macro. Its development includes a local demo and a Forge runtime. Public release is still being prepared.',
			de: 'Team Feed ist eine Atlassian-App, die Confluence-Dokumente und ausgewählte Markdown-Updates in einem gemeinsamen Feed bündelt. Leser kehren an ihre gespeicherte Stelle zurück, und Diskussionen bleiben direkt beim jeweiligen Beitrag.\n\nDie App läuft als Makro in Confluence-Seiten. Zur Entwicklung gehören eine lokale Demo und eine Forge-Laufzeit. Die öffentliche Veröffentlichung wird noch vorbereitet.'
		},
		category: 'web',
		status: 'in-development',
		tags: ['Atlassian', 'Confluence'],
		stack: ['Vue', 'TypeScript', 'Atlassian Forge']
	},
	{
		slug: 'roomplan-nvim',
		title: { en: 'RoomPlan', de: 'RoomPlan' },
		tagline: {
			en: 'Plan rooms and furniture inside Neovim.',
			de: 'Räume und Möbel direkt in Neovim planen.'
		},
		body: {
			en: 'RoomPlan is a floor planner for Neovim, built around keyboard controls and exact metric geometry. Rooms, furniture, doors, windows and outlets belong to the same editable plan.\n\nPlans can be saved as JSON or embedded in a Norg document. The terminal canvas is a view of the stored measurements, so display rounding does not change the plan.',
			de: 'RoomPlan ist ein Grundrissplaner für Neovim mit Tastatursteuerung und exakter metrischer Geometrie. Räume, Möbel, Türen, Fenster und Steckdosen gehören zum selben bearbeitbaren Plan.\n\nPläne lassen sich als JSON speichern oder in ein Norg-Dokument einbetten. Die Terminalansicht stellt die gespeicherten Masse dar; Rundungen auf dem Bildschirm verändern den Plan nicht.'
		},
		category: 'neovim',
		tags: ['Neovim', 'open source'],
		stack: ['Lua', 'Neovim'],
		links: [
			{
				label: 'Source',
				url: 'https://github.com/LuixBits/luixbits-roomplanner.nvim',
				rel: 'source'
			}
		],
		videos: [
			{
				id: 'roomplan-showcase',
				title: 'I built a floor planner in Neovim',
				provider: 'youtube',
				src: 'bAPyriQQsNM',
				poster: '/media/projects/luixbits/roomplanner.jpg',
				duration: 789
			}
		]
	},
	{
		slug: 'neorg-flashcards',
		title: { en: 'Flashcards', de: 'Flashcards' },
		tagline: {
			en: 'Local flashcards, review sessions and plain Norg files.',
			de: 'Lokale Lernkarten, Wiederholungen und einfache Norg-Dateien.'
		},
		body: {
			en: 'A flashcard workspace for Neovim. Each subject has its own collection, card types, review schedule and history, stored locally as plain Norg files.\n\nCards can be created, browsed and reviewed in the editor. Neorg improves ordinary file editing, but the flashcard workspace also works without it.',
			de: 'Ein Lernkarten-Arbeitsbereich für Neovim. Jedes Fach hat eine eigene Sammlung, Kartentypen, einen Wiederholungsplan und einen Verlauf, lokal in einfachen Norg-Dateien gespeichert.\n\nKarten lassen sich im Editor erstellen, durchsuchen und wiederholen. Neorg verbessert die normale Dateibearbeitung; der Lernkarten-Arbeitsbereich funktioniert auch ohne Neorg.'
		},
		category: 'neovim',
		tags: ['Neovim', 'learning', 'open source'],
		stack: ['Lua', 'Neovim', 'Norg'],
		links: [
			{
				label: 'Source',
				url: 'https://github.com/LuixBits/luixbits-neorg-flashcards.nvim',
				rel: 'source'
			}
		]
	},
	{
		slug: 'noctalia-plugins',
		title: { en: 'Noctalia Plugins', de: 'Noctalia-Plugins' },
		tagline: {
			en: 'Desktop tools, starting with the Casio Deck.',
			de: 'Desktop-Werkzeuge, angefangen mit dem Casio Deck.'
		},
		body: {
			en: 'A collection of plugins for Noctalia. Casio Deck connects a Bluetooth Casio watch to desktop controls on Linux and Wayland.\n\nThe collection gives these desktop experiments a shared home. The Casio project and its setup are also documented on LuixBits.',
			de: 'Eine Sammlung von Plugins für Noctalia. Casio Deck verbindet eine Bluetooth-Casio-Uhr mit Desktop-Steuerungen unter Linux und Wayland.\n\nDie Sammlung gibt diesen Desktop-Experimenten einen gemeinsamen Platz. Das Casio-Projekt und seine Einrichtung sind auch auf LuixBits dokumentiert.'
		},
		category: 'desktop',
		tags: ['Noctalia', 'Linux', 'open source'],
		links: [
			{
				label: 'Source',
				url: 'https://github.com/LuixBits/luixbits-noctalia-plugins',
				rel: 'source'
			}
		],
		videos: [
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
		slug: 'magic-mouse',
		title: { en: 'Magic Mouse', de: 'Magic Mouse' },
		tagline: {
			en: 'A standalone app for the Magic Mouse.',
			de: 'Eine eigenständige App für die Magic Mouse.'
		},
		body: {
			en: 'An upcoming standalone application for the Magic Mouse. Features and release details will be added as the project takes shape.',
			de: 'Eine geplante eigenständige Anwendung für die Magic Mouse. Funktionen und Details zur Veröffentlichung folgen, wenn das Projekt konkreter wird.'
		},
		category: 'desktop',
		status: 'upcoming',
		tags: ['desktop', 'input']
	}
]);

export const projectCategories = [
	{ id: 'youtube', anchor: 'youtube' },
	{ id: 'web', anchor: 'web' },
	{ id: 'neovim', anchor: 'neovim' },
	{ id: 'desktop', anchor: 'desktop' },
	{ id: 'experiments', anchor: 'experiments' }
] as const;

export function projectsByCategory(category: Project['category']): Project[] {
	return projects.filter((p) => p.category === category);
}

export function getProject(slug: string): Project | undefined {
	return projects.find((p) => p.slug === slug);
}
