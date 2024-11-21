import type { PageServerLoad } from './$types';
import { retrieveClientById } from '$lib/server/database/queries/clients';
import { retrieveItemsAccountsByClientId } from '$lib/server/database/queries/items';
export const load: PageServerLoad = async ({ params }) => {
	const items = await retrieveItemsAccountsByClientId(params.id);
	const client = await retrieveClientById(params.id)
	return {
		items, client
	};
}