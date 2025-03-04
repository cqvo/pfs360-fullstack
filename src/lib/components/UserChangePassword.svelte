<script lang="ts">
	import { getContext } from 'svelte';
	import { enhance } from '$app/forms';
	import type { ToastContext } from '@skeletonlabs/skeleton-svelte';
	import { Check } from 'lucide-svelte';

	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let newPasswordValid = $derived(newPassword.length >= 8);
	let newPasswordConfirmed = $derived(newPassword === confirmPassword && confirmPassword !== '');

	const user = getContext('user');

	const responseHandler = ({ data }) => {
		const toastOptions = {
			title: data.success ? 'Success' : 'Error',
			description: data.success ? 'Password changed successfully' : data.message,
			type: data.success ? 'success' : 'error'
		};
		toast.create(toastOptions);
		currentPassword = '';
		newPassword = '';
		confirmPassword = '';
	};

	export const toast: ToastContext = getContext('toast');
</script>

<div class="mx-auto max-w-md">
	<p>Signed in as:</p>
	<p class="font-bold">{user.email}</p>
	<form
		class="space-y-2"
		action="/user?/changePassword"
		method="post"
		use:enhance={() => {
			return async ({ result }) => {
				responseHandler(result);
			};
		}}
	>
		<input class="hidden" type="email" name="email" autocomplete="email" value={user.email} />
		<label class="label">
			<span class="label-text">Current Password</span>
			<input
				class="input"
				type="password"
				name="currentPassword"
				autocomplete="current-password"
				bind:value={currentPassword}
			/>
		</label>
		<label class="label">
			<div class="flex">
				<span class="label-text">New Password</span>{#if newPasswordValid}<Check
						size={16}
						color="#00b300"
					/>{/if}
			</div>

			<input
				class="input"
				type="password"
				name="newPassword"
				autocomplete="new-password"
				bind:value={newPassword}
			/>
		</label>
		<label class="label">
			<div class="flex">
				<span class="label-text">Confirm New Password</span>{#if newPasswordConfirmed}<Check
						size={16}
						color="#00b300"
					/>{/if}
			</div>
			<input
				class="input"
				type="password"
				name="confirmPassword"
				autocomplete="new-password"
				bind:value={confirmPassword}
			/>
		</label>
		<div class="label-text">
			<p class="font-extrabold">Requirements</p>
			<ul class="list-inside list-disc">
				<li>Minimum 8 characters</li>
			</ul>
		</div>
		<button
			class="btn my-4 preset-tonal-primary"
			disabled={!newPasswordValid || !newPasswordConfirmed}
		>
			Change Password
		</button>
	</form>
</div>
