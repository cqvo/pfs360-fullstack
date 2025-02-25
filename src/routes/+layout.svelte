<script lang="ts">
	import '../app.css';
	let { data, children } = $props();
	import { AppBar, Navigation, ToastProvider } from '@skeletonlabs/skeleton-svelte';
	import {
		LayoutGrid,
		Menu,
		Users,
		FileText,
		CloudUpload,
		Settings,
		LogIn,
		LogOut
	} from 'lucide-svelte';
	import { signIn, signOut } from '@auth/sveltekit/client';
</script>

<header class="flex h-min justify-center gap-2 p-2">
	<Navigation.Tile label="Dashboard" href="/" width="w-24">
		<LayoutGrid />
	</Navigation.Tile>
	<Navigation.Tile label="Clients" href="/clients" width="w-24">
		<Users />
	</Navigation.Tile>
	<Navigation.Tile label="Upload" href="/upload" width="w-24">
		<CloudUpload />
	</Navigation.Tile>
	<Navigation.Tile label="Settings" href="/settings" width="w-24">
		<Settings />
	</Navigation.Tile>
	{#if !data.session}
		<Navigation.Tile
			id="signInTile"
			label="Sign In'}"
			width="w-24"
			onclick={() => {
				signIn();
			}}
		>
			<LogIn />
		</Navigation.Tile>
	{:else}
		<Navigation.Tile
			id="signOutTile"
			label="Sign Out"
			width="w-24"
			onclick={() => {
				signOut();
			}}
		>
			<LogOut />
		</Navigation.Tile>{/if}
</header>

<ToastProvider placement="top-end">
	<main class="container mx-auto">
		{@render children()}
	</main>
</ToastProvider>