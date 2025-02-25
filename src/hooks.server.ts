import type { Handle } from '@sveltejs/kit';
import User from '$lib/apps/client/class/User';

import { handle as authHandle } from '$lib/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await authHandle({ event, resolve });
	console.log('hooks.server.ts: authHandle response', response);

	const session = await event.locals.auth();
	if (session?.user?.email) {
		const user = await User.findOne(session.user.email);
		console.log('hooks.server.ts: user', user);
		if (!user) {
			throw new Error('hooks.server.ts: No user found.');
		}
		event.locals.user = user;
	}
	return await resolve(event);
}
