<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import { AppBar, Navigation } from '@skeletonlabs/skeleton-svelte';
	import { LayoutGrid, Menu, Users, FileText } from 'lucide-svelte';
</script>


	<header class="flex h-min gap-2 p-2 justify-center">
				<Navigation.Tile id="0" label="Dashboard" href="/" width="w-24">
					<LayoutGrid />
				</Navigation.Tile>
				<Navigation.Tile id="1" label="Clients" href="/clients" width="w-24">
					<Users />
				</Navigation.Tile>
				<Navigation.Tile id="2" label="Reports" href="/reports" width="w-24">
					<FileText />
				</Navigation.Tile>
	</header>
	<main class="container mx-auto">
		{@render children()}
	</main>

