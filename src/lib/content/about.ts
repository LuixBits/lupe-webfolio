import { defineAbout } from './schema';

/** Edit me — this is the About section content. */
export const about = defineAbout({
	name: 'Luiz Perren',
	role: {
		en: 'Researcher, builder, and open-source contributor exploring systems, visual perception, and digital craft.',
		de: 'Forscher, Entwickler und Open-Source-Beitragender – Systeme, visuelle Wahrnehmung und digitale Handwerkskunst.'
	},
	/* Portrait for the crown's bower — drop a photo at
	 * static/media/about/portrait-800.webp (4:5 works best), then uncomment:
	 *
	 * portrait: {
	 * 	src: '/media/about/portrait-800.webp',
	 * 	width: 800,
	 * 	height: 1000,
	 * 	alt: { en: 'Portrait of Luiz Perren', de: 'Porträt von Luiz Perren' }
	 * },
	 */
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
	/* The descent. The page reads like a real tree: newest growth in the crown
	 * (today), oldest parts deepest — scrolling down travels back in time.
	 * Order here IS the page order: heartwood (what I'm made of) → branches
	 * (what I reach for) → underground: roots (where it began) → mycelium
	 * (what feeds me). Placeholder voice — owner: rewrite in your own words;
	 * structure (ids) is load-bearing, prose is not. Paragraphs split on
	 * blank lines. */
	chapters: [
		{
			id: 'pioneer',
			kicker: { en: 'Heartwood', de: 'Kernholz' },
			title: { en: 'ADHD — my pioneer species', de: 'ADHS — meine Pionierart' },
			body: {
				en: 'When a storm opens a clearing, the first tree back is the pioneer species: fast, hungry for light, growing in six directions at once. That’s the most accurate picture of my ADHD I’ve found.\n\nIt means my attention doesn’t queue politely — it floods. The same head that loses its keys can sink into a problem for eight hours straight and surface holding something nobody asked it to find. Divergent by default, hyperfocused when it matters: most of what I’m proud of was built in that weather.\n\nA forest of pioneers still needs tending — routines, lists, deadlines that act like trellises. I’ve stopped treating that as a flaw to hide and started treating it as my growing condition: this is simply the climate I do my best work in.',
				de: 'Wenn ein Sturm eine Lichtung reißt, ist der erste Baum, der zurückkehrt, die Pionierart: schnell, hungrig nach Licht, in sechs Richtungen gleichzeitig wachsend. Das ist das treffendste Bild für mein ADHS, das ich gefunden habe.\n\nEs bedeutet: Meine Aufmerksamkeit stellt sich nicht höflich an — sie flutet. Derselbe Kopf, der die Schlüssel verliert, kann acht Stunden in einem Problem versinken und mit etwas auftauchen, wonach niemand gefragt hat. Divergent als Grundzustand, hyperfokussiert, wenn es zählt: Das meiste, worauf ich stolz bin, ist bei diesem Wetter entstanden.\n\nEin Pionierwald braucht trotzdem Pflege — Routinen, Listen, Deadlines als Rankhilfen. Ich habe aufgehört, das als Makel zu verstecken, und angefangen, es als meine Kulturbedingung zu behandeln: Das ist schlicht das Klima, in dem ich am besten arbeite.'
			}
		},
		{
			id: 'branches',
			kicker: { en: 'Branchwork', de: 'Geäst' },
			title: { en: 'Passions', de: 'Leidenschaften' },
			body: {
				en: 'A tree doesn’t choose one direction; it reaches for every patch of light it can find. That’s how my passions work. At night I point a telescope at the sky and stack faint photons into galaxies. By day I fly drones to borrow a bird’s perspective, or sit very still until wildlife forgets I’m there.\n\nThey look like separate hobbies, but they’re one habit: building instruments to see what eyes alone can’t.',
				de: 'Ein Baum entscheidet sich nicht für eine Richtung; er streckt sich nach jedem Fleck Licht, den er findet. Genau so funktionieren meine Leidenschaften. Nachts richte ich ein Teleskop auf den Himmel und stapele schwache Photonen zu Galaxien. Tagsüber leihe ich mir mit der Drohne den Blick eines Vogels — oder sitze so still, bis die Wildtiere vergessen, dass ich da bin.\n\nEs sieht aus wie getrennte Hobbys, ist aber eine einzige Gewohnheit: Instrumente bauen, um zu sehen, was Augen allein nicht können.'
			},
			sprouts: [
				{
					title: { en: 'Astrophotography', de: 'Astrofotografie' },
					body: {
						en: 'Hours of patience, stacked into one image of something unreasonably far away.',
						de: 'Stunden an Geduld, gestapelt zu einem Bild von etwas unvernünftig Weitem.'
					}
				},
				{
					title: { en: 'Drone flights', de: 'Drohnenflüge' },
					body: {
						en: 'Perspective as a tool — the world explains itself differently from above.',
						de: 'Perspektive als Werkzeug — von oben erklärt sich die Welt anders.'
					}
				},
				{
					title: { en: 'Wildlife', de: 'Wildtiere' },
					body: {
						en: 'Sitting still long enough that the forest resumes around you.',
						de: 'So lange stillsitzen, bis der Wald um dich herum weitermacht.'
					}
				},
				{
					title: { en: 'Building things', de: 'Dinge bauen' },
					body: {
						en: 'Code, optics, small machines — if it can be made, it can be understood.',
						de: 'Code, Optik, kleine Maschinen — was man bauen kann, kann man verstehen.'
					}
				}
			]
		},
		{
			id: 'roots',
			kicker: { en: 'Forest floor · where it began', de: 'Waldboden · wo es begann' },
			title: { en: 'Roots', de: 'Wurzeln' },
			body: {
				en: 'Every forest starts below the surface. Mine is made of early curiosity — taking things apart to see how they work, putting them back together slightly better or slightly worse, and being equally delighted either way.\n\nWhat grounds me hasn’t changed since: honest questions, patient observation, and the stubborn belief that understanding something deeply is its own reward. Everything above ground grows from there.',
				de: 'Jeder Wald beginnt unter der Oberfläche. Meiner besteht aus früher Neugier — Dinge auseinandernehmen, um zu sehen, wie sie funktionieren, sie wieder zusammensetzen, mal etwas besser, mal etwas schlechter, und mich in beiden Fällen gleich sehr freuen.\n\nWas mich erdet, hat sich seitdem nicht geändert: ehrliche Fragen, geduldiges Beobachten und der sture Glaube, dass tiefes Verstehen seine eigene Belohnung ist. Alles über der Erde wächst von dort.'
			}
		},
		{
			id: 'mycelium',
			kicker: { en: 'Below the floor', de: 'Unter dem Boden' },
			title: { en: 'Mycelium', de: 'Myzel' },
			body: {
				en: 'Under every forest runs a network that connects trees that will never touch — nutrients from a sunny clearing feeding a sapling in the shade. Ideas work the same way for me.\n\nA rendering trick becomes a way to think about attention. A pattern from bird flight ends up in a codebase. I keep a compost heap of half-ideas and let them rot productively; the good ones fruit later, usually somewhere unexpected. If we talk for ten minutes, I will probably hand you one.',
				de: 'Unter jedem Wald verläuft ein Netzwerk, das Bäume verbindet, die sich nie berühren werden — Nährstoffe aus einer sonnigen Lichtung füttern einen Schössling im Schatten. Genauso funktionieren Ideen bei mir.\n\nEin Rendering-Trick wird zu einer Denkfigur über Aufmerksamkeit. Ein Muster aus dem Vogelflug landet im Code. Ich pflege einen Komposthaufen halber Ideen und lasse sie produktiv verrotten; die guten tragen später Früchte, meist an unerwarteter Stelle. Wenn wir zehn Minuten reden, drücke ich dir vermutlich eine in die Hand.'
			}
		}
	],
	links: [
		{ label: 'Email', url: 'mailto:luizperren96@gmail.com', rel: 'external' },
		{ label: 'GitHub', url: 'https://github.com/LuixBits', rel: 'source' },
		{ label: 'YouTube', url: 'https://youtube.com/', rel: 'external' }
	]
});
