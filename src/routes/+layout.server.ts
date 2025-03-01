import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { createLogger } from '$lib/server/LoggerFactory';

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.auth();
	if (!session) {
		redirect(303, '/auth/signin');
	}
	return {
		user: {
			email: event.locals.user.email,
			role: event.locals.user.role
		}
	};
};