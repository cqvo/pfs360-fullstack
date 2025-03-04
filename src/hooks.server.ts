import type { Handle } from '@sveltejs/kit';
import User from '$lib/apps/client/class/User';
import { createLogger } from '$lib/server/LoggerFactory';
import { handle as authHandle } from '$lib/auth';

const logger = createLogger({ component: 'hooks.server.ts' });

const userCache = new Map();
const CACHE_TTL = 5 * 60 * 1000;
let lastCleanup = Date.now();

const cleanupCache = () => {
	const now = Date.now();
	if (now - lastCleanup < 60 * 1000) {
		return;
	}
	for (const [key, value] of userCache.entries()) {
		if (now - value.timestamp > CACHE_TTL) {
			userCache.delete(key);
		}
	}
	lastCleanup = now;
};

// import { handle } from '$lib/auth';
export { handle } from "$lib/auth"

// export const handle: Handle = async ({ event, resolve }) => {
// 	try {
// 		cleanupCache();
// 		const response = await authHandle({ event, resolve });
// 		if (response) {
// 			return response
// 		}
// 		const session = await event.locals.auth();
// 		if (session?.user?.email) {
// 			const email = session.user.email;
// 			const cacheEntry = userCache.get(email);
// 			if (cacheEntry && Date.now() - cacheEntry.timestamp < CACHE_TTL) {
// 				event.locals.user = cacheEntry.user;
// 			} else {
// 				try {
// 					const user = await User.findOne(email);
// 					if (!user) {
// 						logger.warn('User not found for email:', email);
// 						return new Response('User', { status: 401 });
// 					}
// 					userCache.set(email, { user, timestamp: Date.now() });
// 					event.locals.user = user;
// 				} catch (dbError) {
// 					logger.error('Database error:', dbError);
// 					return new Response('Database error', { status: 500 });
// 				}
// 			}
// 		}
// 		return await resolve(event);
// 	} catch (err) {
// 		logger.error('Unhandled error:', err);
// 		return new Response('Internal Server Error', { status: 500 });
// 	}
// };
