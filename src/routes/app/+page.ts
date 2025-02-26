import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { session } = await parent();
	console.log({session});
	return { session };
};