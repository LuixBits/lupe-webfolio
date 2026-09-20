import { defineProjects, type Project } from './schema';

/** Academic work — research projects and publications. Edit / extend freely. */
export const academia: Project[] = defineProjects([
	{
		slug: 'sample-research',
		title: { en: 'Sample Research Project', de: 'Beispiel-Forschungsprojekt' },
		tagline: {
			en: 'A placeholder for an academic project.',
			de: 'Ein Platzhalter für ein akademisches Projekt.'
		},
		body: {
			en: 'Describe the research question, method, and outcome here.',
			de: 'Beschreibe hier die Forschungsfrage, Methode und das Ergebnis.'
		},
		tags: ['research'],
		year: 2025,
		featured: true,
		sources: [
			{
				id: 'ref1',
				title: 'A relevant paper',
				url: 'https://example.com/paper',
				kind: 'paper',
				year: 2024
			}
		]
	}
]);

/** Publications listed under the #publications section. */
export const publications: Project[] = defineProjects([
	{
		slug: 'sample-publication',
		title: { en: 'Sample Publication', de: 'Beispiel-Publikation' },
		tagline: { en: 'Venue, year.', de: 'Ort, Jahr.' },
		body: { en: 'Abstract or summary.', de: 'Abstract oder Zusammenfassung.' },
		tags: ['publication'],
		year: 2024,
		links: [{ label: 'PDF', url: 'https://example.com/pub.pdf', rel: 'writeup' }]
	}
]);

export function getAcademiaProject(slug: string): Project | undefined {
	return [...academia, ...publications].find((p) => p.slug === slug);
}
