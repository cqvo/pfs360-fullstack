<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	const client = data.client[0];

</script>

<h1 class="h1">{client.companyName}</h1>
<p>Link status:</p>
<button class="btn">Create Link</button>