<script lang="ts">
	import type { PageData } from './$types';
	import ItemStatus from '$lib/components/ItemStatus.svelte';
	import { updated } from '$app/stores';
	let { data }: { data: PageData } = $props();
	const { items } = data;
</script>

<h1 class="h1">{items[0].dimClients.companyName}</h1>

<div class="flex gap-4 p-4">
{#each items as item}
{@const updated = new Date(item.updatedAt).toLocaleDateString()}
	<div
		class="card block max-w-md divide-y overflow-hidden border-[1px] border-surface-200-800 divide-surface-200-800 preset-filled-surface-100-900"
	>
		<header class="space-y-4 p-4">
			<h4 class="h4">{item.dimInstitutions.name}</h4>
		</header>
		<div class="space-y-4 p-4">
			<p><ItemStatus status={item.status} /></p>
			<p><small class="opacity-60">Last updated {updated}</small></p>
			{#if item.status !== 'Active'}
				<small>This account is not active</small>
			{/if}
		</div>
		<article class="space-y-4 p-4">
			{#each item.dimAccounts as account}
				<p class="opacity-60">{account.name}</p>
			{/each}
		</article>
	</div>
{/each}
</div>