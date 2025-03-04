<script lang="ts">
	import type { LayoutProps } from './$types';
	import { setContext } from 'svelte';
	let { data, children }: LayoutProps = $props();
	setContext('user', data.user);
</script>

{@render children()}