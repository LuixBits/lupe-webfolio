import type { LayoutServerLoad } from './$types';

/** Compute the copyright year once on the server and serialize it to the client,
 *  so the footer never hydration-mismatches across a New-Year boundary. */
export const load: LayoutServerLoad = () => ({ year: new Date().getFullYear() });
