<script lang="ts">
	import FancyInput from './FancyInput.svelte';
	let { data } = $props();
	let message = $state(JSON.stringify(data.users));
</script>

<FancyInput bind:value={message} />
<p>{message}</p>