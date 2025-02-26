<script lang="ts">
	import '../../app.css';
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
		LogOut, Logs
	} from 'lucide-svelte';
	import { signIn, signOut } from '@auth/sveltekit/client';
</script>

<header class="flex h-min justify-center gap-2 p-2">
	<Navigation.Tile label="Dashboard" href="/app" width="w-24">
		<LayoutGrid />
	</Navigation.Tile>
	<Navigation.Tile label="Clients" href="/app/clients" width="w-24">
		<Users />
	</Navigation.Tile>
	<Navigation.Tile label="Upload" href="/app/upload" width="w-24">
		<CloudUpload />
	</Navigation.Tile>
	<Navigation.Tile label="Settings" href="/app/settings" width="w-24">
		<Settings />
	</Navigation.Tile>
	<Navigation.Tile label="Changelog" href="/app/changelog" width="w-24">
		<Logs />
	</Navigation.Tile>
	{#if !data.session}
		<Navigation.Tile
			id="signInTile"
			label="Sign In"
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
	<main class="container mx-auto max-w-screen-lg space-y-4">
		{@render children()}
	</main>
</ToastProvider>