<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	const clients = data.clients;
</script>

<div class="table-wrap">
	<table class="table">
		<thead>
		<tr>
			<th>Company</th>
			<th>Link Status</th>
			<th>Name</th>
		</tr>
		</thead>
		<tbody class="hover:[&>tr]:preset-tonal-primary">
		{#each clients as client}
				<tr>
					<td><a href="/clients/{client.id}">{client.companyName}</a></td>
					<td><span class="badge preset-tonal-error">Error</span></td>
					<td>{client.emailAddress}</td>
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