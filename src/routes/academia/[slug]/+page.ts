import { error } from '@sveltejs/kit';
import { getAcademiaProject } from '$lib/content/academia';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const project = getAcademiaProject(params.slug);
	if (!project) error(404, 'Not found');
	return { project };
};
