<script lang="ts">
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';
	import { ROLES } from '$lib/UserPermissions.js';
	import { Modal, type ToastContext } from '@skeletonlabs/skeleton-svelte';
	import { getContext } from 'svelte';

	let openState = $state(false);
	let { user, refreshUsers }: PageProps = $props();

	const modalClose = () => {
		openState = false;
	};

	const formResponseHandler = ({ data }) => {
		const toastOptions = {
			title: data.success ? 'Success' : 'Error',
			description: data.message,
			type: data.success ? 'success' : 'error'
		};
		toast.create(toastOptions);
	};

	export const toast: ToastContext = getContext('toast');
</script>

<Modal
	open={openState}
	onOpenChange={(e) => (openState = e.open)}
	triggerBase="btn preset-tonal-primary"
	contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm w-full"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet trigger()}Options{/snippet}
	{#snippet content()}
		<form class="space-y-4"
			method="POST"
			action="/user?/updateRole"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.data.success === true) {
						formResponseHandler(result);
						refreshUsers();
					}
				};
			}}
		>
			<header class="flex justify-between">
				<h2 class="h2">{user.email}</h2>
			</header>
			<article>
				<h4 class="h4">Role</h4>

				<input class="hidden" type="email" name="email" value={user.email} />
				<select class="select" name="role">
					{#each Object.values(ROLES) as role}
						<option value={role} selected={user.role === role}>{role}</option>
					{/each}
				</select>
			</article>
			<footer class="flex justify-end gap-4">
				<button type="button" class="btn preset-tonal" onclick={modalClose}>Cancel</button>
				<button type="submit" class="btn preset-filled-primary-500" onclick={modalClose}
					>Confirm</button
				>
			</footer>
		</form>
	{/snippet}
</Modal>
