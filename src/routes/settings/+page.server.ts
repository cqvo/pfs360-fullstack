import type { Actions, PageServerLoad } from './$types';

let user = null;

export const load: PageServerLoad = async (event) => {
	user = event.locals.user;
	console.log('load user', user);
}

export const actions = {
	changePassword: async ({ request }) => {
		try {
			const data = await request.formData();
			const currentPassword = data.get('currentPassword');
			const newPassword = data.get('newPassword');
			const currentPasswordValid = await user.comparePassword(currentPassword);
			console.log('currentPasswordValid', currentPasswordValid);
			if (!currentPasswordValid) {
				return {
					success: false,
					message: 'Current password is incorrect.'
				}
			}
			return {
				success: true,
				message: 'Password changed.'
			}
		} catch (e) {
			//handle error
		}
	},
} satisfies Actions;