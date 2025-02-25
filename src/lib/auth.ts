import { SvelteKitAuth } from '@auth/sveltekit';
import Credentials from '@auth/sveltekit/providers/credentials';
import User from '$lib/apps/client/class/User';
import { VERCEL_ENV } from '$lib/config';

const providers = [
	Credentials({
		credentials: {
			email: {},
			password: {}
		},
		authorize: async (credentials) => {
			const { email, password } = credentials;
			const user = User.findOne(email);
			if (!user) {
				throw new Error('No user found.');
			}
			return user;
		}
	})
];

const pages = {
	signIn: '/signin',
}

let trustHost = {};
if (VERCEL_ENV) {
	trustHost = { trustHost: true };
}

export const { signIn, signOut, handle } = SvelteKitAuth({
	providers,
	// pages,
	...trustHost
});
