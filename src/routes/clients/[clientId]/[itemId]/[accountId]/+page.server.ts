import type { PageServerLoad } from './$types'
import accountService from '$lib/apps/account/service';
import logger from '$lib/logger';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const account = await accountService.getAccount(params.accountId);
		console.log(account);
		return {
			account: {...account, _id: account._id.toString()}
		}
	} catch (e) {
		console.error('1Error in Controller [clientId]/[itemId]/[accountId]/+page.server.ts:', e);
		throw error(500, 'Error in Controller [clientId]/[itemId]/[accountId]/+page.server.ts')
	}
};;