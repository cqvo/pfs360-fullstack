import type { RequestHandler } from '@sveltejs/kit';
import User from '$lib/apps/client/class/User';

export const GET: RequestHandler = async () => {
	const query = await User.findAll();
	const users = [];
	query.map((user) => {
		const obj = {
			id: user.id.toString(),
			email: user.email,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			role: user.role
		};
		users.push(obj);
	});
	return new Response(JSON.stringify(users), { status: 200 });
}