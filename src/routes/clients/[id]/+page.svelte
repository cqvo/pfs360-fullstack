<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import ItemStatus from '$lib/components/ItemStatus.svelte';

	let { data }: { data: PageData } = $props();
</script>

<h1 class="h1">{data.items[0].dimClients.companyName}</h1>
<div class="">
	<form method="post" action="?/createLink">
		<button type="submit" class="btn preset-tonal-primary">Link New Bank</button>
	</form>
</div>

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