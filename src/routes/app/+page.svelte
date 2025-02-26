<script lang="ts">
	import type { PageProps } from './$types';
	import logo from '$lib/assets/logo.png';
	import chrisbowling from '$lib/assets/chris-bowling.png';

	let { data }: PageProps = $props();
	const user = data?.session?.user;
</script>

<section class="mx-auto">
	{#if user.email === 'admin@pfs360llc.com'}
		<p class="text-center">Welcome Chris!</p>
	<img src={chrisbowling} alt="logo" class="mx-auto" />
		{:else}
		<img src={logo} alt="logo" class="mx-auto" />
		{/if}
</section>