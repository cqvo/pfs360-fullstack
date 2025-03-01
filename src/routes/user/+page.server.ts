import type { PageServerLoad } from './$types';
import { type Actions } from '@sveltejs/kit';
import User from '$lib/apps/client/class/User';
import { createLogger } from '$lib/server/LoggerFactory';

const logger = createLogger({ component: 'user/+page.server.ts' });

export const load: PageServerLoad = async (event) => {
	return {};
};

export const actions: Actions = {
	changePassword: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email');
		try {
			const user = await User.findOne(email);
			if (!user) {
				return {
					success: false,
					message: 'User not found.'
				};
			}
			const currentPassword = data.get('currentPassword');
			const currentPasswordValid = await user.comparePassword(currentPassword);
			if (!currentPasswordValid) {
				logger.info(`changePassword() - User ${email} entered incorrect password.`);
				return {
					success: false,
					message: 'Current password is incorrect.'
				};
			}
			// await user.updatePassword(newPassword);
			logger.info(`changePassword() - User ${email} updated password.`);
			return {
				success: true,
				message: 'Password changed.'
			};
		} catch (err) {
			logger.error('Database error:', err);
			return {
				success: false,
				message: 'Database error.'
			};
		}
	},
	createUser: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;
		const role = data.get('role') as string;
		console.log({ email, password, role });
		if (!email || !password || !role) {
			return {
				success: false,
				message: 'Missing required fields.'
			};
		}
		try {
			const user = await User.insertNew(email, password, role);
			logger.info(`createUser() - User ${user.email} created.`);
			return {
				success: true,
				message: 'User created.',
				user: user
			};
		} catch (err) {
			logger.error('Database error:', err);
			return {
				success: false,
				message: 'Database error.'
			};
		}
	},
	deleteUser: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		if (!email) {
			return {
				success: false,
				message: 'No email provided.'
			};
		}
		try {
			await User.delete(email);
			logger.info(`deleteUser() - User ${email} deleted.`);
			return {
				success: true,
				message: 'User deleted.'
			};
		} catch (err) {
			logger.error('Database error:', err);
			return {
				success: false,
				message: 'Database error.'
			};
		}
	}
};
