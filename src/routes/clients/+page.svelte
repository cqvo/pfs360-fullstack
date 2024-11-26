<script lang="ts">
	import type { PageData } from './$types';
	import { Segment } from '@skeletonlabs/skeleton-svelte';
	import ItemStatus from '$lib/components/ItemStatus.svelte';

	let { data }: { data: PageData } = $props();
	let clientList = $state('linked');
</script>

<!-- <div class="flex justify-center">
	<Segment name="clientList" bind:value={clientList}>
		<Segment.Item value="linked">Linked</Segment.Item>
		<Segment.Item value="unlinked">Unlinked</Segment.Item>
	</Segment>
</div> -->

<div class="table-wrap">
<table class="table">
	<thead>
		<tr>
			<th>Company</th>
			<th>Link Status</th>
		</tr>
	</thead>
	<tbody>
		{#each data.clients as client}
		{#each client.dimItems as item}
			<tr>
				<td><a href="/clients/{client.id}" class="anchor">{client.companyName}</a></td>
				<td>
					<ItemStatus status={item.status} />
				</td>
			</tr>
			{/each}
		{/each}
	</tbody>
</table>

<!-- {#if clientList === 'unlinked'}
<table class="table">
	<thead>
		<tr>
			<th>Company</th>
		</tr>
	</thead>
	<tbody>
		{#each data.clients as client}
			{#if client.dimItems.length === 0}
			<tr>
				<td>
					<a href="/clients/{client.id}" class="anchor">{client.companyName}</a>
				</td>
			</tr>
			{/if}
		{/each}
	</tbody>
</table>

{:else if clientList === 'linked'}

<table class="table">
	<thead>
		<tr>
			<th>Company</th>
			<th>Link Status</th>
			<th>Institution</th>
			<th>Account</th>
		</tr>
	</thead>
	<tbody>
		{#each data.clients as client}
		{#each client.dimItems as item}
			<tr>
				<td rowspan={item.dimAccounts.length}>{client.companyName}</td>
				<td rowspan={item.dimAccounts.length}>{item.status}</td>
				<td>{item.dimAccounts[0].name}</td>
				<td>{item.dimAccounts[0].type}</td>
			</tr>
			{#each item.dimAccounts.slice(1) as account}
				<tr>
					<td>{account.name}</td>
					<td>{account.type}</td>
				</tr>
			{/each}
		{/each}
		{/each}
	</tbody>
</table>
{/if} -->
</div>