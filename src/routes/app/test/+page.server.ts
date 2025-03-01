import { type Actions } from '@sveltejs/kit';
import { getContext } from 'svelte';

export const actions = {
	default: async (request) => {
		return {
			success: true
		};
	}
} satisfies Actions;
