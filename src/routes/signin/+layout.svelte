<script lang="ts">
	import '../../app.css';
	let { children } = $props();
</script>

<main class="container mx-auto max-w-screen-lg">
	{@render children()}
</main>