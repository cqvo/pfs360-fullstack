<script lang="ts">
	// import type { PageProps } from './$types';
	import { enhance } from '$app/forms';
	import { Tabs } from '@skeletonlabs/skeleton-svelte';
	import { getContext } from 'svelte';
	import { type ToastContext } from '@skeletonlabs/skeleton-svelte';
	import { Check } from 'lucide-svelte'

	export const toast: ToastContext = getContext('toast');
	let { data } = $props();
	let group = $state('changePassword');
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let newPasswordValid = $derived(newPassword.length >= 8);
	let newPasswordConfirmed = $derived(newPassword === confirmPassword && confirmPassword !== '');

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
		{#if data.role === 'admin'}<Tabs.Control value="manageUsers">Manage Users</Tabs.Control>{/if}
	{/snippet}
	{#snippet content()}
		<Tabs.Panel value="changePassword">
			<div class="mx-auto max-w-md">
				<form class="space-y-2" action="?/changePassword" method="post" use:enhance={() => {
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
						<div class="flex"><span class="label-text">New Password</span>{#if newPasswordValid}<Check size={16} color="#00b300" />{/if}</div>

						<input class="input" type="password" name="newPassword" bind:value={newPassword} />
					</label>
					<label class="label">
						<div class="flex"><span class="label-text">Confirm New Password</span>{#if newPasswordConfirmed}<Check size={16} color="#00b300" />{/if}</div>
						<input
							class="input"
							type="password"
							name="confirmPassword"
							bind:value={confirmPassword}
						/>
					</label>
					<div class="label-text">
					<p class="font-extrabold">Requirements</p>
					<ul class="list-inside list-disc">
						<li>Minimum 8 characters</li>
					</ul></div>
					<button
						class="btn preset-tonal-primary my-4"
						disabled={!newPasswordValid || !newPasswordConfirmed}
					>
						Change Password
					</button>
				</form>
			</div>
		</Tabs.Panel>
		{#if data.role === 'admin'}
			<Tabs.Panel value="manageUsers">
				asdfasdfasdf
			</Tabs.Panel>
			{/if}
	{/snippet}
</Tabs>