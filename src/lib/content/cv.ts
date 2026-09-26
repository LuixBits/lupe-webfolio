import {
	defineEducation,
	definePositions,
	defineProjects,
	defineStations,
	type Education,
	type Position,
	type Project,
	type Station
} from './schema';

/** The dive stations — the real CV (LinkedIn export, 2026-09). Depth = time:
 *  `start`/`end` order the stations; the visible strings are literal.
 *  `skills` arrays are partial — the export truncates ("+4 Kenntnisse") —
 *  so the known-real entries ship plus one "— placeholder" slot where the
 *  source said "+N"; the owner fills the real remainders. */
export const stations: Station[] = defineStations([
	{
		id: 'siga-dev',
		track: 'work',
		org: 'SIGA',
		role: { en: 'Developer Customer Experience', de: 'Developer Customer Experience' },
		span: { en: 'Jul 2024 – today', de: 'Juli 2024 – heute' },
		start: 2024.5,
		end: null,
		duration: { en: '2 yrs 3 mos', de: '2 Jahre 3 Monate' },
		location: { en: 'Ruswil LU', de: 'Ruswil LU' },
		pensum: 'full',
		mode: { en: 'Hybrid', de: 'Hybrid' },
		skills: [{ en: 'Skills — placeholder', de: 'Kenntnisse — Platzhalter' }],
		group: 'siga',
		groupNote: { en: 'SIGA · 5 yrs 2 mos', de: 'SIGA · 5 Jahre 2 Monate' },
		url: 'https://www.siga.swiss'
	},
	{
		id: 'siga-trainee',
		track: 'work',
		org: 'SIGA',
		role: { en: 'Trainee Digitalisierung', de: 'Trainee Digitalisierung' },
		span: { en: 'Aug 2021 – Jul 2024', de: 'Aug. 2021 – Juli 2024' },
		start: 2021.6,
		end: 2024.5,
		duration: { en: '3 yrs', de: '3 Jahre' },
		pensum: 'part',
		skills: [
			{ en: 'Linux Desktop', de: 'Linux Desktop' },
			{ en: 'Software development', de: 'Softwareentwicklung' },
			{ en: 'more — placeholder', de: 'weitere — Platzhalter' }
		],
		group: 'siga'
	},
	{
		id: 'hslu-ma',
		track: 'education',
		org: 'Hochschule Luzern',
		role: { en: 'MA Design — Digital Ideation', de: 'MA Design — Digital Ideation' },
		span: { en: 'Aug 2021 – Jul 2024', de: 'Aug. 2021 – Juli 2024' },
		start: 2021.6,
		end: 2024.5,
		skills: [
			{ en: 'UX', de: 'UX' },
			{ en: 'Svelte', de: 'Svelte' },
			{ en: '+4 — placeholder', de: '+4 — Platzhalter' }
		],
		url: 'https://www.hslu.ch'
		// detail: 'thesis' — wired once the thesis scroll exists at /cv/thesis
	},
	{
		id: 'hslu-bsc',
		track: 'education',
		org: 'Hochschule Luzern',
		role: { en: 'BSc Computer Science — Major HCID', de: 'BSc Informatik — Major HCID' },
		span: '2018 – 2021',
		start: 2018.7,
		end: 2021.6,
		skills: [
			{ en: 'Linux Desktop', de: 'Linux Desktop' },
			{ en: 'Ubuntu', de: 'Ubuntu' },
			{ en: '+4 — placeholder', de: '+4 — Platzhalter' }
		],
		url: 'https://www.hslu.ch'
	},
	{
		id: 'neptun',
		track: 'work',
		org: 'Projekt Neptun',
		role: {
			en: 'Support staff · Head of Help Point Lucerne',
			de: 'Support Mitarbeiter · Leitung Help Point Luzern'
		},
		span: { en: 'Feb 2019 – Jul 2021', de: 'Feb. 2019 – Juli 2021' },
		start: 2019.1,
		end: 2021.5,
		duration: { en: '2 yrs 6 mos', de: '2 Jahre 6 Monate' },
		location: { en: 'Lucerne', de: 'Luzern' },
		pensum: 'part',
		skills: [{ en: 'Linux Desktop', de: 'Linux Desktop' }],
		url: 'https://www.projektneptun.ch'
	},
	{
		id: 'armee',
		track: 'work',
		org: 'Schweizer Armee',
		role: { en: 'Medic (Sanitätssoldat)', de: 'Sanitätssoldat' },
		span: { en: 'Jul 2017 – Apr 2018', de: 'Juli 2017 – Apr. 2018' },
		start: 2017.5,
		end: 2018.3,
		duration: { en: '10 mos', de: '10 Monate' }
	},
	{
		id: 'efz',
		track: 'education',
		org: 'EMVs Visp',
		role: { en: 'EFZ Informatik', de: 'EFZ Informatik' },
		span: '2013 – 2017',
		start: 2013.6,
		end: 2017.6,
		skills: [{ en: 'Skills — placeholder', de: 'Kenntnisse — Platzhalter' }]
	},
	{
		id: 'bm',
		track: 'education',
		org: 'BFS Oberwallis',
		role: {
			en: 'Technische Berufsmaturität (TALS)',
			de: 'Technische Berufsmaturität (TALS)'
		},
		span: '2013 – 2017',
		start: 2013.6,
		end: 2017.6
	},
	{
		id: 'emvs-lehre',
		track: 'work',
		org: 'EMVs Sion',
		role: { en: 'Apprentice (Informatik)', de: 'Lernender Informatik' },
		span: '2013 – 2017',
		start: 2013.6,
		end: 2017.6,
		duration: { en: '4 yrs', de: '4 Jahre' }
	}
]);

/** The Flaschenpost target — the CV as a PDF. Stays undefined until the
 *  owner drops the real file (expected: static/media/cv/luiz-perren-cv.pdf);
 *  the bottle renders a "PDF folgt — placeholder" tag meanwhile. */
export const cvPdf: string | undefined = undefined;

/** CV / Lebenslauf — research work and publications. Placeholder-but-plausible
 *  copy; replace with the real thing. */
export const research: Project[] = defineProjects([
	{
		slug: 'adaptive-perception-algorithms',
		title: {
			en: 'Adaptive Perception Algorithms for Real-time Visual Systems',
			de: 'Adaptive Wahrnehmungsalgorithmen für Echtzeit-Visualsysteme'
		},
		tagline: {
			en: 'Optimizing latency and accuracy in computer vision pipelines under resource constraints',
			de: 'Optimierung von Latenz und Genauigkeit in Computer-Vision-Pipelines unter Ressourcenbeschränkungen'
		},
		body: {
			en: 'Developed a framework for dynamically adjusting algorithmic parameters based on available compute and input complexity. Applications span autonomous systems, edge devices, and real-time processing workflows. Published in proceedings and supported by reproducible code.',
			de: 'Entwickelte ein Framework zur dynamischen Anpassung algorithmischer Parameter basierend auf verfügbarer Rechenleistung und Eingangskomplexität. Anwendungen umfassen autonome Systeme, Edge-Geräte und Echtzeit-Verarbeitungsabläufe.'
		},
		tags: ['computer-vision', 'systems'],
		year: 2024,
		featured: true
	},
	{
		slug: 'distributed-sensor-fusion',
		title: {
			en: 'Distributed Sensor Fusion for Multi-agent Systems',
			de: 'Verteilte Sensorfusion für Multi-Agent-Systeme'
		},
		tagline: {
			en: 'Robust coordination through decentralized information aggregation',
			de: 'Robuste Koordination durch dezentralisierte Informationsaggregation'
		},
		body: {
			en: 'Investigated consensus algorithms and information-theoretic bounds for fusing sensor data across networked agents without central coordination. Relevant for robotics, IoT systems, and resilient infrastructure. Includes open-source reference implementations.',
			de: 'Untersuchte Konsensalgorithmen und informationstheoretische Grenzen für die Sensordatenfusion über vernetzte Agenten ohne zentrale Koordination. Umfasst Open-Source-Referenzimplementierungen.'
		},
		tags: ['robotics', 'distributed-systems'],
		year: 2023
	},
	{
		slug: 'efficient-neural-representations',
		title: {
			en: 'Efficient Neural Representations for Sparse High-dimensional Data',
			de: 'Effiziente neuronale Darstellungen für spärliche hochdimensionale Daten'
		},
		tagline: {
			en: 'Reducing memory footprint and inference time without sacrificing expressiveness',
			de: 'Reduzierung von Speicherbedarf und Inferenzzeit ohne Beeinträchtigung der Aussagekraft'
		},
		body: {
			en: 'Explored structured sparsity and quantization for compressing learned representations. Sample entry — the real findings and numbers go here.',
			de: 'Erforschte strukturierte Sparsität und Quantisierung zur Komprimierung gelernter Darstellungen. Beispieleintrag — echte Ergebnisse und Zahlen folgen.'
		},
		tags: ['machine-learning'],
		year: 2022
	}
]);

/** Publications (venue lives in `tagline`). */
export const publications: Project[] = defineProjects([
	{
		slug: 'perception-in-low-light',
		title: {
			en: 'Perception in Low-light Environments: Challenges and Solutions',
			de: 'Wahrnehmung in schwach beleuchteten Umgebungen: Herausforderungen und Lösungen'
		},
		tagline: {
			en: 'Sample venue — replace with the real citation',
			de: 'Beispiel-Venue — durch die echte Zitation ersetzen'
		},
		body: {
			en: 'Survey and novel methods for robust visual recognition under limited illumination — noise characterization, denoising strategies, and end-to-end learning. Paired with a reference implementation and benchmark dataset.',
			de: 'Übersicht und neuartige Methoden für robuste visuelle Erkennung bei schwacher Beleuchtung. Gepaart mit einer Referenzimplementierung und einem Benchmark-Datensatz.'
		},
		tags: ['publication'],
		year: 2025,
		links: [{ label: 'PDF', url: 'https://example.com/low-light.pdf', rel: 'writeup' }],
		/** SAMPLE paper: exercises every field of the scroll reader. status
		 *  'sample' renders a visible sample-entry note — keep it until the
		 *  real paper replaces this. */
		paper: {
			authors: ['Luiz Perren', 'Sample Coauthor'],
			venue: {
				en: 'Sample venue — replace with the real citation',
				de: 'Beispiel-Venue — durch die echte Zitation ersetzen'
			},
			status: 'sample',
			abstract: {
				en: 'This is a sample abstract standing in for the real one. It exists so the scroll reader can be designed against text of a realistic length: two to three sentences that state the problem, the approach, and what the reader can expect from the sections below.',
				de: 'Dies ist ein Beispiel-Abstract als Platzhalter für das echte. Es existiert, damit der Rollenleser mit realistisch langem Text gestaltet werden kann: zwei bis drei Sätze zu Problem, Ansatz und dem, was die Abschnitte darunter erwartet.'
			},
			sections: [
				{
					id: 'method',
					heading: { en: 'Method', de: 'Methode' },
					body: {
						en: 'A sample method section. Real prose will replace this paragraph; it is long enough to show how body text sits on the paper, how paragraphs breathe, and where a figure lands after a section.\n\nA second sample paragraph demonstrates paragraph spacing on the scroll.',
						de: 'Ein Beispiel-Methodenteil. Echter Text ersetzt diesen Absatz; er ist lang genug, um Fließtext, Absatzabstände und die Position einer Abbildung nach einem Abschnitt zu zeigen.\n\nEin zweiter Beispielabsatz zeigt den Absatzabstand auf der Rolle.'
					},
					figures: ['fig-method']
				},
				{
					id: 'results',
					heading: { en: 'Results', de: 'Ergebnisse' },
					body: {
						en: 'A sample results section referencing Fig. 2. The headline numbers below are dummies wired to the results row.',
						de: 'Ein Beispiel-Ergebnisteil mit Verweis auf Abb. 2. Die Kennzahlen darunter sind Platzhalter für die Ergebniszeile.'
					},
					figures: ['fig-results']
				}
			],
			figures: [
				{
					id: 'fig-method',
					image: {
						src: '/media/papers/perception/fig-01-1600.webp',
						width: 1600,
						height: 900,
						alt: { en: 'Sample line chart', de: 'Beispiel-Liniendiagramm' }
					},
					caption: {
						en: 'Sample figure — a placeholder chart in the real figure frame.',
						de: 'Beispielabbildung — Platzhalterdiagramm im echten Abbildungsrahmen.'
					}
				},
				{
					id: 'fig-results',
					image: {
						src: '/media/papers/perception/fig-02-1600.webp',
						width: 1600,
						height: 900,
						alt: { en: 'Sample bar chart', de: 'Beispiel-Balkendiagramm' }
					},
					caption: {
						en: 'Sample figure — results placeholder.',
						de: 'Beispielabbildung — Ergebnis-Platzhalter.'
					}
				}
			],
			results: [
				{ value: 'n×', label: { en: 'sample metric', de: 'Beispielmetrik' } },
				{ value: '0.00', label: { en: 'sample score', de: 'Beispielwert' } }
			],
			links: {
				pdf: 'https://example.com/low-light.pdf',
				code: 'https://github.com/LuixBits'
			},
			bibtex:
				'@article{perren2025sample,\n  title   = {Perception in Low-light Environments: Challenges and Solutions},\n  author  = {Perren, Luiz and Coauthor, Sample},\n  journal = {SAMPLE VENUE — replace},\n  year    = {2025}\n}'
		}
	},
	{
		slug: 'open-source-infrastructure-survey',
		title: {
			en: 'Building Sustainable Open-Source Infrastructure: A Case Study Approach',
			de: 'Aufbau nachhaltiger Open-Source-Infrastruktur: Ein Case-Study-Ansatz'
		},
		tagline: {
			en: 'Sample venue — replace with the real citation',
			de: 'Beispiel-Venue — durch die echte Zitation ersetzen'
		},
		body: {
			en: 'Examined governance, maintenance patterns, and community dynamics in long-lived open-source projects, drawing on experience maintaining several widely-used libraries. Includes recommendations for new maintainers and funding models.',
			de: 'Untersuchte Governance, Wartungsmuster und Gemeinschaftsdynamik in langlebigen Open-Source-Projekten. Enthält Empfehlungen für neue Verwalter und Finanzierungsmodelle.'
		},
		tags: ['publication', 'open-source'],
		year: 2024,
		links: [{ label: 'PDF', url: 'https://example.com/oss-infra.pdf', rel: 'writeup' }]
	}
]);

/** Education — the bedrock strata at the bottom of the CV pond.
 *  PLACEHOLDER content (clearly marked); replace with the real degrees. */
export const education: Education[] = defineEducation([
	{
		span: '2019 – 2021',
		degree: {
			en: 'M.Sc. Computer Science — placeholder',
			de: 'M.Sc. Informatik — Platzhalter'
		},
		institution: 'Sample University of Technology',
		note: {
			en: 'Thesis title goes here — replace with the real one.',
			de: 'Titel der Abschlussarbeit hier — durch den echten ersetzen.'
		}
	},
	{
		span: '2015 – 2019',
		degree: {
			en: 'B.Sc. Computer Science — placeholder',
			de: 'B.Sc. Informatik — Platzhalter'
		},
		institution: 'Sample University',
		note: {
			en: 'Focus areas / minor go here.',
			de: 'Schwerpunkte / Nebenfach hier eintragen.'
		}
	}
]);

/** Positions — appointments and roles, newest first.
 *  PLACEHOLDER content (clearly marked); replace with the real stations. */
export const positions: Position[] = definePositions([
	{
		span: { en: '2022 – today', de: '2022 – heute' },
		role: {
			en: 'Research Engineer — placeholder',
			de: 'Research Engineer — Platzhalter'
		},
		org: 'Example Institute for Applied Research',
		note: {
			en: 'One line on what the role actually covers.',
			de: 'Eine Zeile dazu, was die Rolle tatsächlich umfasst.'
		}
	},
	{
		span: '2021 – 2022',
		role: {
			en: 'Software Developer — placeholder',
			de: 'Softwareentwickler — Platzhalter'
		},
		org: 'Example Company GmbH'
	}
]);

export function getCvProject(slug: string): Project | undefined {
	return [...research, ...publications].find((p) => p.slug === slug);
}
