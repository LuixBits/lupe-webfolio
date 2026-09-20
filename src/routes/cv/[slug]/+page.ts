import { error } from '@sveltejs/kit';
import { getCvProject } from '$lib/content/cv';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const project = getCvProject(params.slug);
	if (!project) error(404, 'Not found');
	return { project };
};
