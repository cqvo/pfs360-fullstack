import { type Actions } from '@sveltejs/kit';

export const actions = {
	default: async (request) => {
		return {
			success: true
		};
	}
} satisfies Actions;
