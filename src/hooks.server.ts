import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { sectionIdForUrl } from '$lib/radial-menu/menu';
import { dataThemeForSection } from '$lib/themes';

/** Detect the request locale and stamp <html lang>. Also derive the theme from
 *  the route and stamp <html data-theme> so the page background / overscroll is
 *  themed on the server (no first-paint flash). The client keeps it in sync on
 *  navigation via an $effect in +layout.svelte. */
export const handle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;
		const theme = dataThemeForSection(sectionIdForUrl(event.url));
		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%lang%', locale).replace('%theme%', theme)
		});
	});
