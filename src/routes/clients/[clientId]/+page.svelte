<script lang="ts">
import type { PageData } from './$types';
import { onMount } from 'svelte';
import { enhance } from '$app/forms';
import { page } from '$app/stores';
import { Modal } from '@skeletonlabs/skeleton-svelte';
let { data }: { data: PageData } = $props();
let linkModalOpenState = $state(false);
const linkModalClose = () => {
	linkModalOpenState = false;
};

// Plaid Link Handler
let openLinkToken = $state('');
let handler = '';
const initializePlaid = async (linkToken: string) => {
	if (typeof Plaid !== 'undefined') {
		handler = await Plaid.create({
			token: linkToken,
			onSuccess: async (publicToken, metadata) => {
				console.log('Plaid onSuccess:', metadata);
				await fetch('?/onSuccess', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					body: new URLSearchParams({
						publicToken: publicToken,
						metadata: JSON.stringify(metadata),
						linkToken: linkToken,
					}),
				});
			},
			onLoad: () => {
			},
			onExit: (err, metadata) => {
				linkModalOpenState = false;
				if (err) {
					console.error('Plaid exit with error:', err);
				}
				console.log('Plaid exited:', metadata);
			},
			onEvent: (eventName, metadata) => {
				// console.log('Plaid event:', eventName, metadata);
			},
		});
	} else {
		console.error('Plaid script is not loaded');
	}
};
const openPlaid = () => {
	if (handler) {
		handler.open();
	} else {
		console.error('Plaid handler is not initialized');
	}
};

onMount(() => {
	if (data.linkToken) {
		openLinkToken = data.linkToken;
		initializePlaid(openLinkToken);
	} else {
		console.log('Did not initialize Plaid, link token is not provided');
	}
});
</script>

<h1 class="h1">{data.companyName}</h1>
<Modal bind:open={linkModalOpenState}
	triggerBase="btn preset-tonal-primary"
	contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
	backdropClasses="backdrop-blur-sm"
	>
	{#snippet trigger()}Link New Bank{/snippet}
	{#snippet content()}
	<h3 class="h3">Step 1</h3>
	<form method="post" action="?/newToken"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.data.success === true) {
					openLinkToken = result.data.linkToken;
					initializePlaid(openLinkToken);
				} else {
					console.error('Failed to generate link token');
				}
			}
		}}
	>
		<button
			class="btn preset-tonal-primary {openLinkToken ? 'disabled' : ''}"
			type="submit">
			Generate Link Token
		</button>
	</form>
		<h3 class="h3">Step 2</h3>
		<button
			class="btn preset-tonal-primary {openLinkToken ? '' : 'disabled'}"
			onclick={() => { openPlaid(); linkModalClose(); }}>
			Open Plaid Link
		</button>
	{/snippet}
</Modal>


<div class="flex gap-4 p-4">
	<dl class="space-y-2">
{#each data.items as item}
	<dt><a class="anchor" href="/clients/{$page.params.clientId}/{item.id}">{item.institutionName}</a></dt>
{/each}
	</dl>

</div>