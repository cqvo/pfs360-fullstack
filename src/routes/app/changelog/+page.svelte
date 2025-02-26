<script lang="ts">
	import Updates from '$lib/components/Updates.svelte';
	import changelog from '$lib/assets/changelog.json';
</script>

<Updates entries={changelog} openFirst />