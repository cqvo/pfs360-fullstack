<script lang="ts">
	import type { PageData } from './$types';
	import { writable, derived } from 'svelte/store';
	import ArrowDownAZ from 'lucide-svelte/icons/arrow-down-a-z';
	import ArrowDownZA from 'lucide-svelte/icons/arrow-down-z-a';
	// Get the clients from props
	export let data: PageData;

	// Stores for search and sorting
	const searchQuery = writable('');
	const sortOrder = writable<'asc' | 'desc'>('asc');

	// Wrap clients into a store.
	const clients = writable(data.clients);

	// Separate derived store for filtering
	const filteredClients = derived(
		[clients, searchQuery],
		([$clients, $searchQuery]) =>
			$clients.filter(client =>
				client.companyName.toLowerCase().includes($searchQuery.toLowerCase())
			)
	);

	// Separate derived store for sorting that depends on the filtered data.
	const sortedClients = derived(
		[filteredClients, sortOrder],
		([$filteredClients, $sortOrder]) => {
			return [...$filteredClients].sort((a, b) => {
				if (a.companyName < b.companyName) return $sortOrder === 'asc' ? -1 : 1;
				if (a.companyName > b.companyName) return $sortOrder === 'asc' ? 1 : -1;
				return 0;
			});
		}
	);

	function toggleSort() {
		sortOrder.update(order => (order === 'asc' ? 'desc' : 'asc'));
	}
</script>

<div class="table-wrap">
	<!-- Search input, binding the value to the searchQuery store -->
	<div class="search">
<!--		<label for="search">Search Company:</label>-->
		<input
			class="input"
			id="search"
			type="search"
			placeholder="Type to search..."
			bind:value={$searchQuery}
		/>
	</div>

	<table class="table">
		<thead>
		<tr>
			<th on:click={toggleSort} style="cursor: pointer;">
				Company {#if $sortOrder === 'asc'}<ArrowDownAZ />{:else}<ArrowDownZA />{/if}
			</th>
		</tr>
		</thead>
		<tbody>
		{#each $sortedClients as client}
			<tr>
				<td>
					<a href="/clients/{client.clientId}" class="anchor">
						{client.companyName}
					</a>
				</td>
			</tr>
		{/each}
		</tbody>
	</table>
</div>