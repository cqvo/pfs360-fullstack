import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';
import User from '$lib/apps/client/class/User';

let user: User | null = null;

export const load: PageServerLoad = async (event) => {
	user = event.locals.user as User;
	console.log('load user', user);
};

export const actions = {
	changePassword: async ({ request }) => {
		try {
			if (!user) {
				return {
					success: false,
					message: 'Session expired.'
				};
			}
			const data = await request.formData();
			const currentPassword = data.get('currentPassword');
			const newPassword = data.get('newPassword');
			const currentPasswordValid = await user.comparePassword(currentPassword);
			console.log('currentPasswordValid', currentPasswordValid);
			if (!currentPasswordValid) {
				return {
					success: false,
					message: 'Current password is incorrect.'
				};
			}
			await user.updatePassword(newPassword);
			return {
				success: true,
				message: 'Password changed.'
			};
		} catch (e) {
			console.error(e);
		}
	}
} satisfies Actions;
