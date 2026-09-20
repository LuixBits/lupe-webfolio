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
	links: z.array(linkSchema).default([])
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
	/** Image URL, or video id/URL (see `provider`). */
	src: z.string(),
	provider: z.enum(['youtube', 'vimeo', 'file']).optional(),
	caption: localizedString.optional(),
	poster: z.string().optional()
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
