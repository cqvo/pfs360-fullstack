<script lang="ts">
	import '../../app.css';
	import { ToastProvider } from '@skeletonlabs/skeleton-svelte';
	import AppNavigation from '$lib/components/AppNavigation.svelte';

	let { children } = $props();
</script>

<header class="flex h-min justify-center gap-2 p-2">
	<AppNavigation />
</header>

<ToastProvider placement="top-end">
	<main class="container mx-auto max-w-screen-lg space-y-4">
		{@render children()}
	</main>
</ToastProvider>