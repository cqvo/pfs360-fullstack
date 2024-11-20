<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	const client = data.clients.dim_clients;
	// const client = data.client.dim_clients;
</script>

<h1 class="h1">{client.companyName}</h1>
<div>
	<h3 class="h3">asdf</h3>
<p>Link status:</p>
</div>
<button class="btn">Create Link</button>