import { error } from '@sveltejs/kit';
import { getCvProject, getVessel } from '$lib/content/cv';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	// vessels first (the fleet's detail pages), then paper scrolls
	const vessel = getVessel(params.slug);
	if (vessel) return { vessel, project: undefined };
	const project = getCvProject(params.slug);
	if (project) return { vessel: undefined, project };
	error(404, 'Not found');
};
