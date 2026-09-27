import {
	defineProjects,
	defineStations,
	defineVessels,
	type Project,
	type Station,
	type Vessel
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
		groupNote: { en: '5 yrs 2 mos', de: '5 Jahre 2 Monate' },
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
		story: {
			en: 'I ran the Lucerne help point: notebook handover weeks at the universities, repairs, and the Linux questions nobody else wanted. — placeholder',
			de: 'Ich habe den Help Point Luzern geführt: Übergabewochen an den Hochschulen, Reparaturen und die Linux-Fragen, die sonst niemand wollte. — Platzhalter'
		},
		takeaway: {
			en: 'Calm support under queue pressure — and Linux as my daily driver. — placeholder',
			de: 'Ruhiger Support trotz Warteschlange — und Linux als Alltag. — Platzhalter'
		},
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
		skills: [{ en: 'Skills — placeholder', de: 'Kenntnisse — Platzhalter' }],
		story: {
			en: 'The school half of the apprenticeship: modules at EMVs Visp, from hardware up to the first real programming. — placeholder',
			de: 'Die Schulseite der Lehre: Module an der EMVs Visp, von Hardware bis zur ersten richtigen Programmierung. — Platzhalter'
		},
		takeaway: {
			en: 'A finished EFZ — and proof that I learn best by building. — placeholder',
			de: 'Das EFZ — und der Beweis, dass ich beim Bauen am besten lerne. — Platzhalter'
		}
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
		end: 2017.6,
		story: {
			en: 'The technical vocational baccalaureate (TALS) alongside the apprenticeship — the maths and science that later carried the degree. — placeholder',
			de: 'Die Technische Berufsmaturität (TALS) parallel zur Lehre — Mathe und Naturwissenschaft, die später das Studium getragen haben. — Platzhalter'
		},
		takeaway: {
			en: 'The door to HSLU. — placeholder',
			de: 'Die Tür zur HSLU. — Platzhalter'
		}
	},
	{
		id: 'emvs-lehre',
		track: 'work',
		org: 'EMVs Sion',
		role: { en: 'Apprentice (Informatik)', de: 'Lernender Informatik' },
		span: '2013 – 2017',
		start: 2013.6,
		end: 2017.6,
		duration: { en: '4 yrs', de: '4 Jahre' },
		skills: [
			{ en: 'Support — placeholder', de: 'Support — Platzhalter' },
			{ en: 'Networks — placeholder', de: 'Netzwerk — Platzhalter' }
		],
		story: {
			en: 'Four years of IT apprenticeship at EMVs in Sion: user support, networks, and the first scripts that saved real hours. — placeholder',
			de: 'Vier Jahre Informatik-Lehre bei der EMVs in Sitten: Support, Netzwerk und die ersten Skripte, die echte Stunden gespart haben. — Platzhalter'
		},
		takeaway: {
			en: 'The craft itself — and a taste for automating the boring parts. — placeholder',
			de: 'Das Handwerk — und die Lust, das Langweilige zu automatisieren. — Platzhalter'
		}
	}
]);

/** The Flaschenpost's cargo — the same CV printed once per world of this
 *  site, plus a plain unthemed one. `file` stays undefined until the owner
 *  drops the PDFs (expected under static/media/cv/, e.g.
 *  luiz-perren-cv.pdf / luiz-perren-cv-garden.pdf / …); the scroll shows a
 *  "folgt — placeholder" chip meanwhile. The pond's bottle always links to
 *  /cv/flaschenpost, where these are offered. */
export interface CvPrint {
	id: 'plain' | 'garden' | 'water' | 'vaporwave' | 'cosmos';
	label: { en: string; de: string };
	note: { en: string; de: string };
	file?: string;
}
export const cvPrints: CvPrint[] = [
	{
		id: 'plain',
		label: { en: 'Plain', de: 'Schlicht' },
		note: {
			en: 'classic, unthemed — for the busy inbox',
			de: 'klassisch, ohne Thema — fürs eilige Postfach'
		}
	},
	{
		id: 'garden',
		label: { en: 'Garden', de: 'Garten' },
		note: { en: "in the About grove's greens", de: 'in den Grüntönen des Hains' }
	},
	{
		id: 'water',
		label: { en: 'Water', de: 'Wasser' },
		note: { en: "on this pond's paper", de: 'auf dem Papier dieses Teichs' }
	},
	{
		id: 'vaporwave',
		label: { en: 'Vaporwave', de: 'Vaporwave' },
		note: { en: 'neon on deep purple', de: 'Neon auf tiefem Violett' }
	},
	{
		id: 'cosmos',
		label: { en: 'Cosmos', de: 'Kosmos' },
		note: { en: 'under the night sky', de: 'unter dem Nachthimmel' }
	}
];

/** THE FLEET — the pond groups the stations by organisation: work floats
 *  (boats), education grows (lily pads). Each vessel is one craft on the
 *  CV pond and one detail page at /cv/<slug>. Order = mooring order along
 *  the current, newest (foreground) first. */
export const vessels: Vessel[] = defineVessels([
	{
		slug: 'siga',
		org: 'SIGA',
		kind: 'boat',
		stationIds: ['siga-dev', 'siga-trainee'],
		span: { en: '2021 – today', de: '2021 – heute' },
		note: { en: '5 yrs 2 mos', de: '5 Jahre 2 Monate' },
		url: 'https://www.siga.swiss'
	},
	{
		slug: 'hslu',
		org: 'Hochschule Luzern',
		kind: 'pads',
		stationIds: ['hslu-ma', 'hslu-bsc'],
		span: '2018 – 2024',
		url: 'https://www.hslu.ch'
	},
	{
		slug: 'neptun',
		org: 'Projekt Neptun',
		kind: 'boat',
		stationIds: ['neptun'],
		span: '2019 – 2021',
		url: 'https://www.projektneptun.ch'
	},
	{
		slug: 'armee',
		org: 'Schweizer Armee',
		kind: 'boat',
		stationIds: ['armee'],
		span: '2017 – 2018'
	},
	{
		slug: 'emvs',
		org: 'EMVs',
		kind: 'boat',
		stationIds: ['emvs-lehre'],
		span: '2013 – 2017'
	},
	{
		// the apprenticeship's SCHOOL side — strictly education, so it grows
		// as lily pads on the education bank (the EMVs boat keeps the job)
		slug: 'schule',
		org: 'EFZ & Berufsmaturität',
		kind: 'pads',
		stationIds: ['efz', 'bm'],
		span: '2013 – 2017'
	}
]);

// Every vessel's stationIds must resolve — a typo fails the build, not a page.
for (const v of vessels)
	for (const id of v.stationIds)
		if (!stations.some((s) => s.id === id))
			throw new Error(`vessel ${v.slug} references unknown station ${id}`);

/** The short name painted on each hull (org names can be too long). */
export const HULL_NAME: Record<Vessel['slug'], { en: string; de: string }> = {
	siga: { en: 'Developer', de: 'Entwickler' },
	hslu: { en: 'Bachelor · Master', de: 'Bachelor · Master' },
	neptun: { en: 'IT Support', de: 'IT-Support' },
	armee: { en: 'Army', de: 'Armee' },
	emvs: { en: 'Apprenticeship', de: 'Lehre' },
	schule: { en: 'Berufsmatura', de: 'Berufsmatura' }
};

export function getVessel(slug: string): Vessel | undefined {
	return vessels.find((v) => v.slug === slug);
}

/** The stations aboard a vessel, in its declared (newest-first) order. */
export function vesselStations(v: Vessel): Station[] {
	return v.stationIds.map((id) => stations.find((s) => s.id === id)!);
}

/** Scroll pages under /cv/[slug]. The sample paper below is the PaperScroll
 *  DESIGN FIXTURE only — it appears in no visible list and exists so the
 *  kakemono reader keeps a realistic layout target until the owner's MA
 *  thesis replaces it (slug 'thesis', then wire stations[hslu-ma].detail). */
export const scrolls: Project[] = defineProjects([
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
	}
]);

export function getCvProject(slug: string): Project | undefined {
	return scrolls.find((p) => p.slug === slug);
}
