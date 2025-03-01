<script lang="ts">
	import { getContext } from 'svelte';
	import { Tabs } from '@skeletonlabs/skeleton-svelte';
	import { ROLES, hasPermission } from '$lib/UserPermissions';
	import UserChangePassword from '$lib/components/UserChangePassword.svelte';
	import UserManagement from '$lib/components/UserManagement.svelte';

	// let group = $state('changePassword');

	const user = getContext('user');
	const hasAdmin = hasPermission(user.role, ROLES.ADMIN);

	let userManagementMounted = $state(false);
	const mountUserManagement = ({ value }) => {
		if (value === 'manageUsers') {
			userManagementMounted = true;
		}
	};
</script>

<Tabs value="changePassword" onValueChange={(value) => mountUserManagement(value)}>
	{#snippet list()}
		<Tabs.Control value="changePassword">Change Password</Tabs.Control>
		<Tabs.Control value="manageUsers" classes={hasAdmin ? '' : 'disabled'}>
			Manage Users
		</Tabs.Control>
	{/snippet}
	{#snippet content()}
		<Tabs.Panel value="changePassword">
			<UserChangePassword />
		</Tabs.Panel>
		<Tabs.Panel value="manageUsers">
			{#if userManagementMounted}
				<UserManagement />
			{/if}
		</Tabs.Panel>
	{/snippet}
</Tabs>
