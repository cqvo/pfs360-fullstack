<script lang="ts">
	import '../../app.css';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	import { signOut } from '@auth/sveltekit/client';

	import LayoutGrid from 'lucide-svelte/icons/layout-grid';
	import Users from 'lucide-svelte/icons/users';
	import CloudUpload from 'lucide-svelte/icons/cloud-upload';
	import Settings from 'lucide-svelte/icons/settings';
	import Logs from 'lucide-svelte/icons/logs';
	import LogOut from 'lucide-svelte/icons/log-out';

	const navItems = [
		{ tileProps: { label: 'Dashboard', href: '/app' }, icon: LayoutGrid },
		{ tileProps: { label: 'Clients', href: '/app/clients' }, icon: Users },
		{ tileProps: { label: 'Upload', href: '/app/upload' }, icon: CloudUpload },
		{ tileProps: { label: 'Settings', href: '/app/settings' }, icon: Settings },
		{ tileProps: { label: 'Changelog', href: '/app/changelog' }, icon: Logs },
		{ tileProps: { label: 'Sign Out', onclick: signOut }, icon: LogOut }
	];
</script>

{#each navItems as item, i}
	<Navigation.Tile id={i.toString()} hover="hover:preset-tonal" width="w-24" {...item.tileProps}>
		<item.icon />
	</Navigation.Tile>
{/each}
