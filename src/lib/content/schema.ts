import { z } from 'zod';

/** Typed, validated content model. All site content (projects, sources, media)
 *  is authored as plain TS objects and parsed through these schemas at module
 *  load, so a malformed entry fails fast at build/dev rather than at runtime. */

export const localizedString = z.record(z.string(), z.string());
/** e.g. { en: "Hello", de: "Hallo" }. Resolve with resolveLocalized(). */
export type LocalizedString = z.infer<typeof localizedString>;

export const sourceSchema = z.object({
	id: z.string(),
	title: z.string(),
	url: z.url(),
	/** Where it came from — a talk, paper, repo, article… */
	kind: z.enum(['article', 'paper', 'repo', 'talk', 'docs', 'other']).default('other'),
	author: z.string().optional(),
	year: z.number().int().optional()
});
export type Source = z.infer<typeof sourceSchema>;

export const videoSchema = z.object({
	id: z.string(),
	title: z.string(),
	provider: z.enum(['youtube', 'vimeo', 'file']),
	/** YouTube/Vimeo id, or an absolute/relative file URL for provider 'file'. */
	src: z.string(),
	poster: z.string().optional(),
	/** Seconds. */
	duration: z.number().optional()
});
export type Video = z.infer<typeof videoSchema>;

export const linkSchema = z.object({
	label: z.string(),
	url: z.url(),
	rel: z.enum(['demo', 'source', 'writeup', 'external']).default('external')
});
export type Link = z.infer<typeof linkSchema>;

/** A locally-hosted image under static/media/… . Intrinsic width/height are
 *  REQUIRED so every rendered <img> reserves its box (zero CLS); `thumb` is a
 *  smaller variant for grids/contact sheets. Convention:
 *  /media/<section>/<slug>/<name>-1600.webp with a sibling <name>-480.webp. */
export const imageRefSchema = z.object({
	src: z.string(),
	width: z.number().int(),
	height: z.number().int(),
	alt: localizedString,
	thumb: z.string().optional()
});
export type ImageRef = z.infer<typeof imageRefSchema>;

/** A captioned figure — used by paper readers and project screenshot reels. */
export const figureSchema = z.object({
	id: z.string(),
	image: imageRefSchema,
	caption: localizedString.optional()
});
export type Figure = z.infer<typeof figureSchema>;

/** An embeddable interactive demo — a same-origin iframe page or a hosted
 *  Unity WebGL build. `src` should be same-origin (/media/…/index.html) for
 *  sandboxed embedding; external demos belong in `demo.url` instead. */
export const embedSchema = z.object({
	kind: z.enum(['iframe', 'unity']),
	src: z.string(),
	/** CSS aspect-ratio value, e.g. '16 / 9'. */
	aspect: z.string().default('16 / 9'),
	title: localizedString
});
export type Embed = z.infer<typeof embedSchema>;

/** Scholarly artefact links — each renders as its own affordance (no pills). */
export const paperLinksSchema = z.object({
	pdf: z.url().optional(),
	doi: z.url().optional(),
	code: z.url().optional(),
	talk: z.url().optional()
});

export const paperSectionSchema = z.object({
	id: z.string(),
	heading: localizedString,
	/** Paragraphs, split on blank lines at render time. */
	body: localizedString,
	/** Figure ids (from paper.figures) placed after this section's prose. */
	figures: z.array(z.string()).default([])
});
export type PaperSection = z.infer<typeof paperSectionSchema>;

/** A full paper attached to a CV entry. `status: 'sample'` marks dummy
 *  content and MUST render a visible sample note — invented citations
 *  presented as real damage trust (see the AI-tells audit). */
export const paperSchema = z.object({
	authors: z.array(z.string()),
	venue: localizedString,
	status: z.enum(['published', 'preprint', 'sample']).default('sample'),
	abstract: localizedString,
	sections: z.array(paperSectionSchema).default([]),
	figures: z.array(figureSchema).default([]),
	/** Headline results, e.g. { value: '4.2×', label: { en: 'faster … ' } }. */
	results: z.array(z.object({ value: z.string(), label: localizedString })).default([]),
	links: paperLinksSchema.default({}),
	bibtex: z.string().optional()
});
export type Paper = z.infer<typeof paperSchema>;

/** Real capture metadata for a hobby shot. Every field optional — the UI
 *  renders nothing for absent fields (never invent coordinates or gear). */
export const captureMetaSchema = z.object({
	/** What was shot — 'M31 · Andromeda Galaxy', 'Red kite'. */
	object: localizedString.optional(),
	location: localizedString.optional(),
	/** ISO date, formatted per-locale at render. */
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.optional(),
	/** Body/optics/aircraft — 'ASI533MC · 72ED apo'. */
	gear: z.string().optional(),
	/** '30×120s @ f/5.6, ISO 800' */
	exposure: z.string().optional(),
	/** Only when truly known — 'RA 00h 42m · DEC +41° 16′'. */
	radec: z.string().optional()
});
export type CaptureMeta = z.infer<typeof captureMetaSchema>;

export const projectSchema = z.object({
	slug: z.string(),
	title: localizedString,
	tagline: localizedString,
	body: localizedString,
	tags: z.array(z.string()).default([]),
	year: z.number().int(),
	featured: z.boolean().default(false),
	/** Groups entries within the Projects section (#youtube / #opensource / #web). */
	category: z.enum(['youtube', 'opensource', 'web']).optional(),
	sources: z.array(sourceSchema).default([]),
	videos: z.array(videoSchema).default([]),
	links: z.array(linkSchema).default([]),
	/** Screenshot reel for the detail page's playback screen. */
	screenshots: z.array(figureSchema).default([]),
	/** Tech stack, displayed as plain printed text (not chips). */
	stack: z.array(z.string()).default([]),
	/** A live demo: external URL and/or a same-origin embeddable build. */
	demo: z
		.object({
			url: z.url().optional(),
			embed: embedSchema.optional()
		})
		.optional(),
	/** Full paper attached to CV research/publication entries. */
	paper: paperSchema.optional()
});
export type Project = z.infer<typeof projectSchema>;

/** A year span: either a plain string ("2015 – 2019") or a localized one when
 *  it contains words ({ en: "2022 – today", de: "2022 – heute" }). */
export const yearSpan = z.union([z.string(), localizedString]);
export type YearSpan = z.infer<typeof yearSpan>;

/** Resolve a YearSpan for display. */
export function resolveSpan(span: YearSpan, locale: string): string {
	return typeof span === 'string' ? span : resolveLocalized(span, locale);
}

/** A CV education stage — degree + institution over a span of years.
 *  Rendered as the "bedrock" strata at the bottom of the CV pond. */
export const educationSchema = z.object({
	span: yearSpan,
	degree: localizedString,
	institution: z.string(),
	note: localizedString.optional()
});
export type Education = z.infer<typeof educationSchema>;

/** A CV position/appointment — role + organisation over a span of years. */
export const positionSchema = z.object({
	span: yearSpan,
	role: localizedString,
	org: z.string(),
	note: localizedString.optional()
});
export type Position = z.infer<typeof positionSchema>;

/** A single item in a hobby gallery — a photo or an embedded/hosted video. */
export const mediaItemSchema = z.object({
	id: z.string(),
	kind: z.enum(['image', 'video']),
	/** Image URL, or video id/URL (see `provider`). Prefer `image` for photos. */
	src: z.string(),
	provider: z.enum(['youtube', 'vimeo', 'file']).optional(),
	caption: localizedString.optional(),
	poster: z.string().optional(),
	/** Sized local image (preferred over bare `src` for photos — zero CLS). */
	image: imageRefSchema.optional(),
	/** Real capture data; absent fields render nothing. */
	meta: captureMetaSchema.optional(),
	/** Featured shots span wider in the contact sheet. */
	featured: z.boolean().default(false)
});
export type MediaItem = z.infer<typeof mediaItemSchema>;

/** A hobby album (astrophotography / drone / wildlife …). */
export const albumSchema = z.object({
	slug: z.string(),
	title: localizedString,
	intro: localizedString,
	media: z.array(mediaItemSchema).default([])
});
export type Album = z.infer<typeof albumSchema>;

/** The About section — who I am, a few highlights, plus contact links. */
export const aboutSchema = z.object({
	name: z.string(),
	role: localizedString,
	bio: localizedString,
	highlights: z
		.array(z.object({ title: localizedString, body: localizedString }))
		.default([]),
	links: z.array(linkSchema).default([])
});
export type About = z.infer<typeof aboutSchema>;

/** Pick a locale out of a LocalizedString, falling back to the base locale. */
export function resolveLocalized(
	value: LocalizedString,
	locale: string,
	baseLocale = 'en'
): string {
	return value[locale] ?? value[baseLocale] ?? Object.values(value)[0] ?? '';
}

/** Parse + validate an array of projects, sorted newest-first. */
export function defineProjects(input: unknown[]): Project[] {
	return z
		.array(projectSchema)
		.parse(input)
		.sort((a, b) => b.year - a.year);
}

/** Parse + validate hobby albums. */
export function defineAlbums(input: unknown[]): Album[] {
	return z.array(albumSchema).parse(input);
}

/** Parse + validate CV education stages (authored newest-first). */
export function defineEducation(input: unknown[]): Education[] {
	return z.array(educationSchema).parse(input);
}

/** Parse + validate CV positions (authored newest-first). */
export function definePositions(input: unknown[]): Position[] {
	return z.array(positionSchema).parse(input);
}

/** Parse + validate the About record. */
export function defineAbout(input: unknown): About {
	return aboutSchema.parse(input);
}
