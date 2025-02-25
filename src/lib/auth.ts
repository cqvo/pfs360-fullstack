import { SvelteKitAuth } from '@auth/sveltekit';
import Credentials from '@auth/sveltekit/providers/credentials';
import User from '$lib/apps/client/class/User';

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

export const { signIn, signOut, handle } = SvelteKitAuth({
	providers
});
