import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const response = await fetch('/api/v1/users');
	const users = await response.json();
	return {
		users
	};
};