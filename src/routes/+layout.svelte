<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import { AppBar, Navigation } from '@skeletonlabs/skeleton-svelte';
	import { LayoutGrid, Menu, Users, FileText, CloudUpload } from 'lucide-svelte';
	import { LayoutGrid, Menu, Users, FileText, CloudUpload } from 'lucide-svelte';
</script>

<header class="flex h-min justify-center gap-2 p-2">
	<Navigation.Tile id="0" label="Dashboard" href="/" width="w-24">
		<LayoutGrid />
	</Navigation.Tile>
	<Navigation.Tile id="1" label="Clients" href="/clients" width="w-24">
		<Users />
	</Navigation.Tile>
	<Navigation.Tile id="2" label="Upload" href="/clients/upload" width="w-24">
		<CloudUpload />
	</Navigation.Tile>
	<Navigation.Tile id="3" label="Reports" href="/reports" width="w-24">
		<FileText />
	</Navigation.Tile>
</header>
<main class="container mx-auto">
	{@render children()}
</main>
