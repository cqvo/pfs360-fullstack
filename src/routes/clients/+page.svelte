<script lang="ts">
	import type { PageData } from './$types';
	import { Segment } from '@skeletonlabs/skeleton-svelte';
	import ItemStatus from '$lib/components/ItemStatus.svelte';

	let clientList = $state('linked');
	let { data }: { data: PageData } = $props();
</script>

<div class="flex justify-center">
	<Segment name="clientList" bind:value={clientList}>
		<Segment.Item value="linked">Linked</Segment.Item>
		<Segment.Item value="unlinked">Unlinked</Segment.Item>
	</Segment>
</div>

<div class="table-wrap">
	<table class="table">
		{#if clientList === 'unlinked'}
			<thead>
				<tr>
					<th>Company</th>
				</tr>
			</thead>
			<tbody>
				{#each data.clients as client}
				{#if client.dimItems.length === 0}
					<tr>
						<td><a href="/clients/{client.id}" class="anchor">{client.companyName}</a></td>
					</tr>
					{/if}
				{/each}
			</tbody>
		{:else if clientList === 'linked'}
			<thead>
				<tr>
					<th>Company</th>
					<th>Institution</th>
					<th>Account</th>
					<td>Link Status</td>
				</tr>
			</thead>
			<tbody>
				{#each data.clients as client}
					{@const itemCount = client.dimItems.length}
					{#if client.dimItems.length === 1}
						{#each client.dimItems as item}
							<tr>
								<td><a href="/clients/{client.id}" class="anchor">{client.companyName}</a></td>
								<td>Institution</td>
								<td>Account</td>
								<td><ItemStatus status={item.status} /></td>
							</tr>
						{/each}
					{:else if client.dimItems.length > 1}
						{#each client.dimItems as item, i}
							{#if i === 0}
								<tr>
									<td rowspan={itemCount}
										><a href="/clients/{client.id}" class="anchor">{client.companyName}</a></td
									>
									<td>Institution</td>
									<td>Account</td>
									<td><ItemStatus status={item.status} /></td>
								</tr>
							{:else}
								<tr>
									<td>Institution</td>
									<td>Account</td>
									<td><ItemStatus status={item.status} /></td></tr
								>
							{/if}
						{/each}
					{/if}
				{/each}
			</tbody>
			<tfoot> </tfoot>
		{/if}
	</table>
</div>
