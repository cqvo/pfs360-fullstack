<script lang="ts">
	import type { PageProps } from './$types';
	import { onMount } from 'svelte';

	import ModalAddNewUser from '$lib/components/ModalAddNewUser.svelte';
	import ModalUserOptions from '$lib/components/ModalUserOptions.svelte';
	import ModalDeleteUser from '$lib/components/ModalDeleteUser.svelte';

	let users = $state([]);

	const fetchUsers = async () => {
		try {
			const response = await fetch('/api/v1/users');
			users = await response.json();
		} catch (error) {
			console.error(error);
		}
	};

	onMount(async () => {
		try {
			if (users.length > 0) return;
			await fetchUsers();
		} catch (error) {
			console.error(error);
		}
	});
</script>

<ModalAddNewUser bind:users={users} />

<div class="mx-auto">
	<div class="table-wrap">
		<table class="table">
			<thead>
				<tr>
					<th>Email</th>
					<th>Role</th>
					<th>Last Updated</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each users as user}
					<tr>
						<td>{user.email}</td>
						<td>{user.role}</td>
						<td>{new Date(user.updatedAt).toLocaleDateString()}</td>
						<td><ModalUserOptions {user} refreshUsers={fetchUsers} /> <ModalDeleteUser {user} refreshUsers={fetchUsers} /></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>