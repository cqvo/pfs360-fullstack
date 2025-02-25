import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const parentData = await event.parent();
	if ( parentData.session ) {
		redirect(303, '/app');
	}
}