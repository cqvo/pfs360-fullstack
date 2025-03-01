export const ROLES = {
	VIEWER: 'viewer',
	DOWNLOADER: 'downloader',
	LINKER: 'linker',
	REQUESTER: 'requester',
	ADMIN: 'admin'
}

// Define the role hierarchy (lower index = lower privilege)
export const ROLE_HIERARCHY = [
	ROLES.VIEWER,
	ROLES.DOWNLOADER,
	ROLES.LINKER,
	ROLES.REQUESTER,
	ROLES.ADMIN
] as const;

export type Role = typeof ROLES[keyof typeof ROLES];

/**
 * Checks if a role has at least the specified permission level
 */
export function hasPermission(userRole: Role, requiredRole: Role): boolean {
	const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole);
	const requiredRoleIndex = ROLE_HIERARCHY.indexOf(requiredRole);

	// If role isn't found in hierarchy, deny access
	if (userRoleIndex === -1) return false;

	// User has this role or higher
	return userRoleIndex >= requiredRoleIndex;
}

/**
 * Store creating function to use in components
 */
import { getContext } from 'svelte';
import { derived, readable, type Readable } from 'svelte/store';

export function getUserRole(): Readable<Role> {
	const user = getContext('user');

	// If using the context approach
	if (user) {
		// Create a derived store from session that extracts the role
		return derived(
			user,
			$user => ($user?.role as Role) || ROLES.VIEWER
		);
	}

	// Fallback for when context is not available
	return readable(ROLES.VIEWER);
}