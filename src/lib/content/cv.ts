import {
	defineEducation,
	definePositions,
	defineProjects,
	type Education,
	type Position,
	type Project
} from './schema';

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
			en: 'Explored structured sparsity and quantization for compressing learned representations — 8–12× compression while maintaining >95% accuracy on benchmarks. Directly informed the design of production inference pipelines.',
			de: 'Erforschte strukturierte Sparsität und Quantisierung zur Komprimierung gelernter Darstellungen — 8–12× Komprimierung bei über 95% Genauigkeit. Informierte direkt das Design von Produktions-Inferenz-Pipelines.'
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
			en: 'IEEE Transactions on Image Processing, Vol. 34, No. 3',
			de: 'IEEE Transactions on Image Processing, Vol. 34, Nr. 3'
		},
		body: {
			en: 'Survey and novel methods for robust visual recognition under limited illumination — noise characterization, denoising strategies, and end-to-end learning. Paired with a reference implementation and benchmark dataset.',
			de: 'Übersicht und neuartige Methoden für robuste visuelle Erkennung bei schwacher Beleuchtung. Gepaart mit einer Referenzimplementierung und einem Benchmark-Datensatz.'
		},
		tags: ['publication'],
		year: 2025,
		links: [{ label: 'PDF', url: 'https://example.com/low-light.pdf', rel: 'writeup' }]
	},
	{
		slug: 'open-source-infrastructure-survey',
		title: {
			en: 'Building Sustainable Open-Source Infrastructure: A Case Study Approach',
			de: 'Aufbau nachhaltiger Open-Source-Infrastruktur: Ein Case-Study-Ansatz'
		},
		tagline: {
			en: 'Journal of Open Research Software, Vol. 12, No. 1',
			de: 'Journal of Open Research Software, Vol. 12, Nr. 1'
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
