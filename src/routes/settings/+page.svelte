<script lang="ts">
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';
	import { Tabs } from '@skeletonlabs/skeleton-svelte';
	import { getContext } from 'svelte';
	import { type ToastContext } from '@skeletonlabs/skeleton-svelte';

	export const toast: ToastContext = getContext('toast');
	let { data }: PageProps = $props();
	let group = $state('changePassword');
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let newPasswordValid = $derived(newPassword.length >= 8);
	let newPasswordConfirmed = $derived(newPassword === confirmPassword);

	const changePasswordHandler = (data) => {
		const toastOptions = {
			title: data.success? 'Success' : 'Error',
			description: data.success ? 'Password changed successfully' : data.message,
			type: data.success ? 'success' : 'error',
		}
		toast.create(toastOptions);
		currentPassword = '';
		newPassword = '';
		confirmPassword = '';
	}
</script>

<Tabs bind:value={group}>
	{#snippet list()}
		<Tabs.Control value="changePassword">Change Password</Tabs.Control>
		<Tabs.Control value="boat">Boat</Tabs.Control>
		<Tabs.Control value="car">Car</Tabs.Control>
	{/snippet}
	{#snippet content()}
		<Tabs.Panel value="changePassword">
			<div class="mx-auto space-y-4">
				<form action="?/changePassword" method="post" use:enhance={() => {
					return async ({result}) => {
						changePasswordHandler(result.data);
					}
				}}>
					<label class="label">
						<span class="label-text">Current Password</span>
						<input
							class="input"
							type="password"
							name="currentPassword"
							bind:value={currentPassword}
						/>
					</label>
					<label class="label">
						<span class="label-text">New Password {newPasswordValid}</span>
						<input class="input" type="password" name="newPassword" bind:value={newPassword} />
					</label>
					<label class="label">
						<span class="label-text">Confirm New Password {newPasswordConfirmed}</span>
						<input
							class="input"
							type="password"
							name="confirmPassword"
							bind:value={confirmPassword}
						/>
					</label>
					<button
						class="btn preset-tonal-primary"
						disabled={!newPasswordValid || !newPasswordConfirmed}
					>
						Change Password
					</button>

				</form>
			</div>
		</Tabs.Panel>
	{/snippet}
</Tabs>
