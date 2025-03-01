import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const layoutData = await parent();
	if ( layoutData.session ) {
		redirect(303, '/app');
	}
}