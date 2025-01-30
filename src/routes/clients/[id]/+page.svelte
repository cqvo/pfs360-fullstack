<script lang="ts">
import type { PageData } from './$types';
import { onMount } from 'svelte';
import { enhance } from '$app/forms';
import { Modal } from '@skeletonlabs/skeleton-svelte';
import ItemStatus from '$lib/components/ItemStatus.svelte';
import PlaidLink from '$lib/components/PlaidLink.svelte';

let { data }: { data: PageData } = $props();
let linkModalOpenState = $state(false);
let itemModalOpenState = $state(false);
let activeItem = $state(null);

const linkModalClose = () => {
	linkModalOpenState = false;
};
const itemModalOpen = (item) => {
	activeItem = item;
	itemModalOpenState = true;
};
const itemModalClose = () => {
	itemModalOpenState = false;
};

// Plaid Link Handler
let openLinkToken = $state('');
let handler = '';
const callbackOnSuccess = async (publicToken, linkToken, metadata) => {
    try {
        console.log('Plaid success:', publicToken, metadata);
        const response = await fetch('?/onSuccess', {
            method: 'POST',
            headers: {
            	'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
				publicToken: publicToken,
				linkToken: linkToken,
            }),
        });
        const result = await response.json();
        if (result.success) {
            console.log('Successfully exchanged public token');
        } else {
            console.error('Failed to exchange public token');
        }
    } catch (error) {
        console.error('Failed to trigger action:', error);
    }
};
const initializePlaid = async (linkToken) => {
	if (typeof Plaid !== 'undefined') {
		handler = await Plaid.create({
			token: linkToken,
			onSuccess: async (publicToken, metadata) => {
				callbackOnSuccess(publicToken, linkToken, metadata);
			},
			onLoad: () => {
				console.log('Plaid Link loaded');
			},
			onExit: (err, metadata) => {
				linkModalOpenState = false;
				if (err) {
					console.error('Plaid exit with error:', err);
				}
				console.log('Plaid exited:', metadata);
			},
			onEvent: (eventName, metadata) => {
				console.log('Plaid event:', eventName, metadata);
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
	console.log('Client data:', data.client.factLinkRequests);
	if (data.client.factLinkRequests[0].linkToken) {
		openLinkToken = data.client.factLinkRequests[0].linkToken;
		initializePlaid(openLinkToken);
	} else {
		console.log('Did not initialize Plaid, link token is not provided');
	}
});
</script>

<h1 class="h1">{data.client.companyName}</h1>
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
				console.log(result);
				if (result.data.success === true) {
					openLinkToken = result.data.linkToken;
					initializePlaid(openLinkToken);
				} else {
					console.error('Failed to generate link token');
				}
			}
		}}
		>
		<input type="hidden" name="clientId" value="{data.client.id}" />
		<button 
			class="btn preset-tonal-primary {openLinkToken ? 'disabled' : ''}" 
			type="submit">
			Generate Link Token
		</button>
	</form>
	<h3 class="h3">Step 2</h3>
	<button 
		class="btn preset-tonal-primary {openLinkToken ? '' : 'disabled'}" 
		onclick={openPlaid}>
		Open Plaid Link
	</button>
	{/snippet}
</Modal>


<div class="flex gap-4 p-4">
{#each data.items as item}
{@const updated = new Date(item.updatedAt).toLocaleDateString()}
<button onclick={() => itemModalOpen(item)} class="min-w-80 card block divide-y overflow-hidden border-[1px] border-surface-200-800 divide-surface-200-800 preset-filled-surface-100-900 card-hover">
	<header class="space-y-4 p-4">
		<h4 class="h4 justify-start">{item.dimInstitutions.name}</h4>
	</header>
	<section class="space-y-4 p-4">
		{#each item.dimAccounts as account}
			<p>{account.name}</p>
		{/each}
	</section>
	<footer class="grid grid-cols-2">
		<div class="justify-self-start"><ItemStatus status={item.status} /></div>
		<small class="justify-self-start content-center opacity-50">{updated}</small>
	</footer>
</button>
{/each}

<Modal bind:open={itemModalOpenState}
	contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
	backdropClasses="backdrop-blur-sm"
	>
	{#snippet content()}
		<h3 class="h3">{activeItem.dimInstitutions.name}</h3>
		<ul class="list inside list-disc">
			{#each activeItem.dimAccounts as account}
				<li>{account.name}</li>
			{/each}
		</ul>
		<form method="post" action="?/newReport">
			<input type="hidden" name="clientId" value="{activeItem.clientId}" />
			<input type="hidden" name="itemId" value="{activeItem.id}" />
			<button 
				class="btn preset-tonal-primary" 
				type="submit">
			Generate {data.lastMonth} Report
		</button>
		</form>
	{/snippet}
</Modal>
	

</div>