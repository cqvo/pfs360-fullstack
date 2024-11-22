import type { Actions, PageServerLoad } from './$types';
import linkController from '$lib/apps/links/linkController';
import { retrieveClientById, upsertClient } from '$lib/server/database/queries/clients';
import { retrieveItemsAccountsByClientId } from '$lib/server/database/queries/items';
import { fail } from '@sveltejs/kit';
import { parse } from 'csv-parse/sync';

export const load: PageServerLoad = async ({ params }) => {
	const clientId = Number(params.id);
	const items = await retrieveItemsAccountsByClientId(clientId);
	const client = await retrieveClientById(clientId)
	return {
		items, client
	};
}

export const actions = {
	createLink: async({ params }) => {
		const clientId = Number(params.id);
		linkController.newLinkCreateRequest(clientId);
	},
} satisfies Actions;