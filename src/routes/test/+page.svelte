<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div>{data.accounts[0].company}</div>

{#each data.accpimts as account}
    <div>{account.name}</div>
{/each}