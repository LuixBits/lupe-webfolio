import { defineAbout } from './schema';

/** Edit me — this is the About section content. */
export const about = defineAbout({
	name: 'Luiz Perren',
	role: {
		en: 'Researcher, builder, and occasional astrophotographer.',
		de: 'Forscher, Entwickler und gelegentlicher Astrofotograf.'
	},
	bio: {
		en: 'I split my time between academic research, building software in the open, and pointing cameras at the sky and at wildlife. This site is a living portfolio that grows around a radial menu.',
		de: 'Ich verteile meine Zeit zwischen akademischer Forschung, quelloffener Softwareentwicklung und dem Richten von Kameras auf den Himmel und die Tierwelt. Diese Seite ist ein lebendiges Portfolio rund um ein radiales Menü.'
	},
	links: [
		{ label: 'Email', url: 'mailto:luizperren96@gmail.com', rel: 'external' },
		{ label: 'GitHub', url: 'https://github.com/LuixBits', rel: 'source' },
		{ label: 'YouTube', url: 'https://youtube.com/', rel: 'external' }
	]
});
