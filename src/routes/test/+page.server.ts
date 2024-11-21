import type { PageServerLoad } from './$types';
import { retrieveClientItemsById } from '$lib/server/database/queries/clients';

export const load: PageServerLoad = async () => {
	const client = await retrieveClientItemsById(2);;
	return {
		client
	};
}