import type { Reroute } from '@sveltejs/kit';
import { deLocalizeUrl } from '$lib/paraglide/runtime';

/** Universal reroute: strip the locale prefix so /de/projects and /projects
 *  resolve to the same SvelteKit route. Paraglide handles locale detection. */
export const reroute: Reroute = (request) => deLocalizeUrl(request.url).pathname;
