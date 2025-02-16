<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<h1 class="h1">Vo Wargaming</h1>
<h3 class="h3">Tartan Bank</h3>
<h5 class="h5">{data.account.official_name}</h5>

<div class="table-wrap">
	<table class="table caption-bottom">
		<caption class="pt-4">Daily Ending Balance</caption>
		<thead>
		<tr>
			<th>Date</th>
			<th>Balance</th>
		</tr>
		</thead>
		<tbody class="hover:[&>tr]:preset-tonal-primary">
		{#each data.account.historical_balances as daily_balance}
			<tr>
				<td>{daily_balance.date}</td>
				<td>{daily_balance.current}</td>
			</tr>
		{/each}
		</tbody>
	</table>
</div>