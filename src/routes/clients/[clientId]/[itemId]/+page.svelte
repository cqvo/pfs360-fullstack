<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	let { data }: { data: PageData } = $props();
	import { page } from '$app/stores';
	let openRequest = $state(false);


</script>

<h1 class="h1">{data.companyName}</h1>
<h3 class="h3">{data.item.institutionName}</h3>

<form method="POST" action="?/requestData"
use:enhance={()=>{
	return async ({ result }) => {
		if (result.data.success === true) {
			openRequest = true;
		}
	}
}}>
<button
	type="submit"
	class="btn preset-tonal-primary {openRequest ? 'disabled' : ''}">
	{#if openRequest === false}Request New Data
		{:else}Request Pending{/if}</button
>
</form>

<div class="flex gap-4 p-4">
	<dl class="space-y-2">
		{#each data.item.accounts as account}
			<dt><a class="anchor" href="/clients/{$page.params.clientId}/{$page.params.itemId}/{account.id}">{account.name} - {account.mask}</a></dt>
		{/each}
	</dl>
</div>
