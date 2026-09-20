import { defineAbout } from './schema';

/** Edit me — this is the About section content. */
export const about = defineAbout({
	name: 'Luiz Perren',
	role: {
		en: 'Researcher, builder, and open-source contributor exploring systems, visual perception, and digital craft.',
		de: 'Forscher, Entwickler und Open-Source-Beitragender – Systeme, visuelle Wahrnehmung und digitale Handwerkskunst.'
	},
	bio: {
		en: "I'm driven by curiosity about how systems work — whether computational, biological, or creative. My work spans academic research, open-source projects that solve real problems, and creative explorations through technology and optics. I believe the best ideas live at intersections: where rigorous thinking meets making, where code serves vision.\n\nWhen not researching or building, you'll find me capturing the night sky through astrophotography, piloting drones to reveal hidden perspectives, or filming wildlife in its natural context. These hobbies ground my technical work in observation and wonder.",
		de: 'Mich treibt die Neugier an, wie Systeme funktionieren – ob rechnerisch, biologisch oder kreativ. Meine Arbeit umfasst akademische Forschung, Open-Source-Projekte, die echte Probleme lösen, und kreative Experimente durch Technologie und Optik. Die besten Ideen entstehen an Schnittstellen: wo rigoroses Denken auf Machen trifft, wo Code der Vision dient.\n\nWenn ich nicht forsche oder baue, fange ich den Nachthimmel per Astrofotografie ein, steuere Drohnen für verborgene Perspektiven oder filme Wildtiere in ihrem natürlichen Kontext. Diese Hobbys verankern meine technische Arbeit in Beobachtung und Staunen.'
	},
	highlights: [
		{
			title: {
				en: 'Research-to-code pipeline',
				de: 'Forschung-zu-Code-Pipeline'
			},
			body: {
				en: 'Turning academic insights into tools and libraries others build with — published findings paired with reproducible implementations.',
				de: 'Akademische Erkenntnisse in Werkzeuge und Bibliotheken verwandeln, mit denen andere bauen – Ergebnisse gepaart mit reproduzierbaren Implementierungen.'
			}
		},
		{
			title: {
				en: 'Visual systems & perception',
				de: 'Visuelle Systeme & Wahrnehmung'
			},
			body: {
				en: 'A deep interest in computer vision, image processing, and how we interpret visual information — through research and through the lens.',
				de: 'Tiefes Interesse an Computer Vision, Bildverarbeitung und daran, wie wir visuelle Information deuten – in der Forschung und durch die Linse.'
			}
		},
		{
			title: {
				en: 'Open-source collaboration',
				de: 'Open-Source-Zusammenarbeit'
			},
			body: {
				en: 'Maintaining tools used in production, with a focus on documentation and usability, and contributing to projects that serve as infrastructure for others.',
				de: 'Werkzeuge pflegen, die in Produktion laufen – mit Fokus auf Dokumentation und Benutzerfreundlichkeit – und zu Projekten beitragen, die anderen als Infrastruktur dienen.'
			}
		}
	],
	links: [
		{ label: 'Email', url: 'mailto:luizperren96@gmail.com', rel: 'external' },
		{ label: 'GitHub', url: 'https://github.com/LuixBits', rel: 'source' },
		{ label: 'YouTube', url: 'https://youtube.com/', rel: 'external' }
	]
});
