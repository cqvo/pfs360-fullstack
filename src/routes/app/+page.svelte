<script lang="ts">
	import { getContext } from 'svelte';
	import logo from '$lib/assets/logo.png';
	import chrisbowling from '$lib/assets/chris-bowling.png';

	const user = getContext('user');
</script>

<section class="mx-auto space-y-4">
	{#if user.email === 'chris@pfs360llc.com'}
		<h3 class="h3 text-center">Welcome Chris!</h3>
	<img src={chrisbowling} alt="logo" class="mx-auto" />
		{:else}
		<p class="text-center">Signed in as: {user.email}</p>
		<img src={logo} alt="logo" class="mx-auto" />
		{/if}
</section>