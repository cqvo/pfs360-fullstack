<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import ItemStatus from '$lib/components/ItemStatus.svelte';
	import PlaidLink from '$lib/components/PlaidLink.svelte';

	let { data }: { data: PageData } = $props();
	let openState = $state(false);
	let linkToken = '';

	const modalClose = () => {
		openState = false;
	};

	const handleResponse = ({ result }: { result: any }) => {
		if (result.success) {
			linkToken = result.linkToken;
		} else {
			console.error(result.error);
		}
	};
</script>

<h1 class="h1">{data.client.companyName}</h1>

<Modal
	bind:open={openState}
	triggerBase="btn preset-tonal-primary"
	contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet trigger()}Link to Plaid{/snippet}
	{#snippet content()}
		<header class="flex justify-between">
			<h2 class="h2">Modal Example</h2>
		</header>
		<article>
			{#if linkToken}
				<PlaidLink linkToken={linkToken} />
			{:else}
			<form method="post" action="?/createLink" use:enhance={{ response: handleResponse }}>
				<button type="submit" class="btn preset-tonal-primary">Link New Bank</button>
			</form>
			{/if}
		</article>
		<!-- <footer class="flex justify-end gap-4">
			<button type="button" class="btn preset-tonal" onclick={modalClose}>Cancel</button>
			<button type="button" class="btn preset-filled" onclick={modalClose}>Confirm</button>
		</footer> -->
	{/snippet}
</Modal>

<div class="flex gap-4 p-4">
{#each data.items as item}
{@const updated = new Date(item.updatedAt).toLocaleDateString()}
	<article
		class="card block max-w-md divide-y overflow-hidden border-[1px] border-surface-200-800 divide-surface-200-800 preset-filled-surface-100-900"
	>
		<header class="space-y-4 p-4">
			<h4 class="h4">{item.dimInstitutions.name}</h4>
		</header>
		<section class="space-y-4 p-4">
			<p><ItemStatus status={item.status} /></p>
			<p><small class="opacity-60">Last updated {updated}</small></p>
			{#if item.status !== 'Active'}
				<small>This account is not active</small>
			{/if}
		</section>
		<section class="space-y-4 p-4">
			{#each item.dimAccounts as account}
				<p>{account.name}</p>
			{/each}
		</section>
	</article>
{/each}
</div>