<script lang="ts">
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';
	import { ROLES } from '$lib/UserPermissions.js';
	import { Modal, type ToastContext } from '@skeletonlabs/skeleton-svelte';
	import { getContext } from 'svelte';

	let openState = $state(false);
	let { user }: PageProps = $props();

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
	contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-lg"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet trigger()}Options{/snippet}
	{#snippet content()}
		<header class="flex justify-between">
			<h2 class="h2">{user.email}</h2>
		</header>
		<article>
			<h4 class="h4">Role</h4>
			<form method="POST" action="/user?/updateRole" use:enhance={() => {} }>
				<select class="select" name="role">
					{#each Object.values(ROLES) as role}
						<option value={role} selected={user.role === role}>{role}</option>
					{/each}
				</select>
			</form>
		</article>
		<footer class="flex justify-end gap-4">
			<button type="button" class="btn preset-tonal" onclick={modalClose}>Cancel</button>
			<button type="submit" class="btn preset-filled" onclick={modalClose}>Confirm</button>
		</footer>
	{/snippet}
</Modal>