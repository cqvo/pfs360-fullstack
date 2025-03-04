import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';
import User from '$lib/apps/client/class/User';
import { hasPermission, ROLES } from '$lib/UserPermissions';
import { createLogger } from '$lib/server/LoggerFactory';
const logger = createLogger({ component: 'settings/+page.server.ts' });

export const load: PageServerLoad = async (event) => {

	return {

	};
};