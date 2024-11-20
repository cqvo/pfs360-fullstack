<script lang="ts">
	import type { PageData } from './$types';
	import ItemStatus from '$lib/components/ItemStatus.svelte';

	let { data }: { data: PageData } = $props();
	const clients = data.clients;
</script>

<div class="table-wrap">
	<table class="table">
		<thead>
		<tr>
			<th>Company</th>
			<th>Account</th>
			<th>Link Status</th>
		</tr>
		</thead>
		<tbody class="hover:[&>tr]:preset-tonal-primary">
		{#each clients as client}
				<tr>
					<td><a href="/clients/{client.dim_clients.id}">{client.dim_clients.companyName}</a></td>
					<td>{client.dim_institutions ? client.dim_institutions.name : ''} {client.dim_accounts ? client.dim_accounts.name : ''}</td>
					<td><ItemStatus status={client.dim_items ? client.dim_items.status : 'N/A'} /></td>
				</tr>
		{/each}
		</tbody>
		<tfoot>
		<tr>
			<td colspan="3">Total</td>
			<td class="text-right">{clients.length} Elements</td>
		</tr>
		</tfoot>
	</table>
</div>