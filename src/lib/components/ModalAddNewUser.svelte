<script lang="ts">
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';
	import { ROLES } from '$lib/UserPermissions.js';
	import { Modal, type ToastContext } from '@skeletonlabs/skeleton-svelte';
	import { getContext } from 'svelte';

	let openState = $state(false);
	let { users = $bindable(), ...props }: PageProps = $props();

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
	{#snippet trigger()}Add New User{/snippet}
	{#snippet content()}
		<header class="flex justify-between">
			<h2 class="h2">New User</h2>
		</header>
		<form
			method="POST"
			action="/user?/createUser"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.data.success === true) {
						users = [...users, result.data.user];
						formResponseHandler(result);
					}
				};
			}}
		>
			<article>
				<label class="label">
					<span class="label-text">Email</span>
					<input class="input" type="email" name="email" />
				</label>
				<label class="label">
					<span class="label-text">Password</span>
					<input class="input" type="text" name="password" value="changeme" />
				</label>
				<label class="label">
					<span class="label-text">Role</span>
					<select class="select" name="role">
						{#each Object.values(ROLES) as role}
							<option value={role}>{role}</option>
						{/each}
					</select>
				</label>
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
