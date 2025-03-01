<script lang="ts">
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';
	import { Modal, type ToastContext } from '@skeletonlabs/skeleton-svelte';
	import { getContext } from 'svelte';

	let openState = $state(false);
	let { user, refreshUsers }: PageProps = $props();
	let confirmEmail = $state('');

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
	triggerBase="btn preset-tonal-error"
	contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-lg"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet trigger()}Delete{/snippet}
	{#snippet content()}
		<form class="space-y-4"
			method="POST"
			action="/user?/deleteUser"
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
				<h2 class="h2">Are you sure?</h2>
			</header>

			<article class="space-y-2">
				<p>This will DELETE user <span class="font-bold">{user.email}</span> permanently.</p>
				<p>Enter the user email below to confirm.</p>
				<p><input class="input" type="text" name="confirmEmail" bind:value={confirmEmail} /></p>
			</article>
			<footer class="flex justify-end gap-4">
				<input class="hidden" type="email" name="email" value={user.email} />
				<button type="button" class="btn preset-tonal" onclick={modalClose}>Cancel</button>
				<button
					type="submit"
					class="btn preset-filled-error-500 {confirmEmail !== user.email ? 'disabled' : ''}"
					onclick={modalClose}>Delete</button
				>
			</footer>
		</form>
	{/snippet}
</Modal>
