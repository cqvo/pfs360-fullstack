import { signOut } from '$lib/server/Auth';
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = { default: signOut };
