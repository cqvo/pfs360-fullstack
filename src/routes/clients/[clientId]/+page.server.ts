import type { Actions, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import clientService from '$lib/apps/client/service';
import logger from '$lib/logger';
import { Client } from '$lib/apps/client/model';

let client: Client;

export const load: PageServerLoad = async ({ params }) => {
	try {
		client = await clientService.getClient(params.clientId);
		const link = client.latestValidLink();
		return {
			companyName: client.companyName,
			items: client.items || [],
			linkToken: link,
		};
	} catch (e) {
		console.error('1Error in Controller [clientId]/+page.server.ts:', e);
		throw error(500, '2Error in Controller [clientId]/+page.server.ts')
	}
};

export const actions = {
	newToken: async () => {
		try {
			const linkToken = await clientService.newLinkCreateRequest(client);
			return {
				success: true,
				linkToken: linkToken,
			}
		} catch (e) {
			console.error('3Error in Controller [clientId]/+page.server.ts:', e);
			throw error(500, '4Error in Controller [clientId]/+page.server.ts')
		}
	},
    onSuccess: async ({ request }) => {
			const data = await request.formData();
			const publicToken = data.get('publicToken');
			const metadataRaw = data.get('metadata');
			const linkToken = data.get('linkToken');
			if (typeof publicToken !== 'string' || typeof metadataRaw !== 'string' || typeof linkToken !== 'string') {
				throw error(400, 'Invalid form data');
			}
			let metadata;
			try {
				metadata = JSON.parse(metadataRaw);
			} catch (e) {
				throw error(400, 'Invalid JSON in metadata');
			}
			try {
				await clientService.webLinkOnSuccess(client, publicToken, metadata, linkToken);
				return { success: true };
			} catch (e) {
				throw error(500, `Error processing onSuccess: ${e}`);
			}
    },
} satisfies Actions;