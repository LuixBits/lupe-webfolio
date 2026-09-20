import { defineAlbums, type Album, type MediaItem } from './schema';

/** Hobby galleries. Each album's slug matches its section anchor on /hobbies
 *  (#astrophotography / #drone / #wildlife). Mix images and videos freely.
 *
 *  SAMPLE DATA: every image below is a generated stand-in under /media/…
 *  (same folder convention the real shots will use). Captions say so.
 *  `meta` fields are filled only where the real data pattern is being
 *  demonstrated — absent fields render nothing, so never invent them. */

const sampleShot = (
	album: string,
	name: string,
	n: number,
	extra: Partial<MediaItem> = {}
): MediaItem => ({
	featured: false,
	id: `${name}-${String(n).padStart(2, '0')}`,
	kind: 'image',
	src: `/media/hobbies/${album}/${name}-${String(n).padStart(2, '0')}-1600.webp`,
	image: {
		src: `/media/hobbies/${album}/${name}-${String(n).padStart(2, '0')}-1600.webp`,
		thumb: `/media/hobbies/${album}/${name}-${String(n).padStart(2, '0')}-480.webp`,
		width: 1600,
		height: 1000,
		alt: { en: 'Sample frame — to be replaced', de: 'Beispielbild — wird ersetzt' }
	},
	caption: { en: 'Sample frame', de: 'Beispielbild' },
	...extra
});

export const albums: Album[] = defineAlbums([
	{
		slug: 'astrophotography',
		title: { en: 'Astrophotography', de: 'Astrofotografie' },
		intro: {
			en: 'Long exposures of the night sky.',
			de: 'Langzeitbelichtungen des Nachthimmels.'
		},
		media: [
			sampleShot('astro', 'plate', 1, {
				featured: true,
				// Demonstrates the full metadata pattern on ONE entry; the values
				// are marked as samples until real capture data replaces them.
				meta: {
					object: { en: 'Sample target', de: 'Beispielobjekt' },
					location: { en: 'Sample site', de: 'Beispielort' },
					date: '2026-08-14',
					gear: 'Sample camera · sample optics',
					exposure: '30×120 s'
				}
			}),
			sampleShot('astro', 'plate', 2),
			sampleShot('astro', 'plate', 3),
			sampleShot('astro', 'plate', 4),
			sampleShot('astro', 'plate', 5),
			sampleShot('astro', 'plate', 6),
			sampleShot('astro', 'plate', 7),
			sampleShot('astro', 'plate', 8)
		]
	},
	{
		slug: 'drone',
		title: { en: 'Drone', de: 'Drohne' },
		intro: { en: 'Aerial photography and flights.', de: 'Luftaufnahmen und Flüge.' },
		media: [
			sampleShot('drone', 'flight', 1, { featured: true }),
			sampleShot('drone', 'flight', 2),
			{
				id: 'flight-video-01',
				kind: 'video',
				provider: 'youtube',
				src: 'dQw4w9WgXcQ',
				caption: { en: 'Sample flight video', de: 'Beispiel-Flugvideo' }
			},
			sampleShot('drone', 'flight', 3),
			sampleShot('drone', 'flight', 4)
		]
	},
	{
		slug: 'wildlife',
		title: { en: 'Wildlife', de: 'Tierwelt' },
		intro: { en: 'Animal videography.', de: 'Tier-Videografie.' },
		media: [
			sampleShot('wildlife', 'sighting', 1, { featured: true }),
			sampleShot('wildlife', 'sighting', 2),
			sampleShot('wildlife', 'sighting', 3),
			sampleShot('wildlife', 'sighting', 4)
		]
	}
]);

export function getAlbum(slug: string): Album | undefined {
	return albums.find((a) => a.slug === slug);
}
