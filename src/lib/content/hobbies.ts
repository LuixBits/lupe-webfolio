import { defineAlbums, type Album } from './schema';

/** Hobby galleries. Each album's slug matches its section anchor on /hobbies
 *  (#astrophotography / #drone / #wildlife). Mix images and videos freely. */
export const albums: Album[] = defineAlbums([
	{
		slug: 'astrophotography',
		title: { en: 'Astrophotography', de: 'Astrofotografie' },
		intro: {
			en: 'Long exposures of the night sky.',
			de: 'Langzeitbelichtungen des Nachthimmels.'
		},
		media: [
			{
				id: 'astro-1',
				kind: 'image',
				src: 'https://picsum.photos/seed/astro1/800/600',
				caption: { en: 'Placeholder — swap for a real shot.', de: 'Platzhalter — durch ein echtes Bild ersetzen.' }
			}
		]
	},
	{
		slug: 'drone',
		title: { en: 'Drone', de: 'Drohne' },
		intro: { en: 'Aerial photography and flights.', de: 'Luftaufnahmen und Flüge.' },
		media: [
			{ id: 'drone-1', kind: 'video', provider: 'youtube', src: 'dQw4w9WgXcQ', caption: { en: 'A flight.', de: 'Ein Flug.' } }
		]
	},
	{
		slug: 'wildlife',
		title: { en: 'Wildlife', de: 'Tierwelt' },
		intro: { en: 'Animal videography.', de: 'Tier-Videografie.' },
		media: [
			{
				id: 'wild-1',
				kind: 'image',
				src: 'https://picsum.photos/seed/wild1/800/600',
				caption: { en: 'Placeholder.', de: 'Platzhalter.' }
			}
		]
	}
]);

export function getAlbum(slug: string): Album | undefined {
	return albums.find((a) => a.slug === slug);
}
