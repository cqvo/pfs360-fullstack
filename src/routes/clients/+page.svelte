<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="table-wrap">
<table class="table">
	<thead>
		<tr>
			<th class="svelte-simple-datatable">Company</th>
		</tr>
	</thead>
	<tbody>
		{#each data.clients as client}
			<tr>
				<td><a href="/clients/{client.id}" class="anchor">{client.companyName}</a></td>
			</tr>
		{/each}
	</tbody>
</table>
</div>