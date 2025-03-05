<script lang="ts">
	import type { PageData } from './$types';
	import { getContext, onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { Accordion, Modal, type ToastContext } from '@skeletonlabs/skeleton-svelte';
	import { ROLES, hasPermission } from '$lib/UserPermissions';

	let { data }: { data: PageData } = $props();

	const user = getContext('user');
	const hasRequester = hasPermission(user.role, ROLES.REQUESTER);

	export const toast: ToastContext = getContext('toast');
	const triggerRequestData = (success) => {
		toast.create({ description: 'New data requested.'})
	}
	let linkModalOpenState = $state(false);
	const accordionState = $state(['']);
	const linkModalClose = () => {
		linkModalOpenState = false;
	};
	let enableRequestData = $state(true);
	const disableRequestData = () => {
		enableRequestData = false;
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
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						body: new URLSearchParams({
							publicToken: publicToken,
							metadata: JSON.stringify(metadata),
							linkToken: linkToken
						})
					});
				},
				onLoad: () => {},
				onExit: (err, metadata) => {
					linkModalOpenState = false;
					if (err) {
						console.error('Plaid exit with error:', err);
					}
					console.log('Plaid exited:', metadata);
				},
				onEvent: (eventName, metadata) => {
					// console.log('Plaid event:', eventName, metadata);
				}
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

<Modal
	bind:open={linkModalOpenState}
	triggerBase="btn preset-tonal-primary"
	contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet trigger()}Link New Bank{/snippet}
	{#snippet content()}
		<h3 class="h3">Step 1</h3>
		<form
			method="post"
			action="?/newToken"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.data.success === true) {
						openLinkToken = result.data.linkToken;
						initializePlaid(openLinkToken);
					} else {
						console.error('Failed to generate link token');
					}
				};
			}}
		>
			<button class="btn preset-tonal-primary {openLinkToken ? 'disabled' : ''}" type="submit">
				Generate Link Token
			</button>
		</form>
		<h3 class="h3">Step 2</h3>
		<button
			class="btn preset-tonal-primary {openLinkToken ? '' : 'disabled'}"
			onclick={() => {
				openPlaid();
				linkModalClose();
			}}
		>
			Open Plaid Link
		</button>
	{/snippet}
</Modal>

<div class="flex gap-4 p-4">
	<Accordion {accordionState} multiple>
		{#each data.items as item, itemIndex}
			<Accordion.Item value={item.institutionName}
											base="border-[1px] border-surface-200-800 w-full"
			>
				<!-- Control -->
				{#snippet control()}
					<span class="h4">{item.institutionName}</span>{/snippet}
				<!-- Panel -->
				{#snippet panel()}
					<form method="POST" action="?/requestData" use:enhance={() => {
						return async ({result}) => {
							triggerRequestData(result.data.success);
						}
					}}>
						<input class="hidden" name="itemIndex" value={itemIndex} />
						<button type="submit" class="btn preset-tonal-primary {enableRequestData && hasRequester ? '' : 'disabled'}" onclick={disableRequestData}> Request Data from Last 120 Days </button>
					</form>
					<div class="table-wrap">
						<table class="table">
							<thead
								><tr><th>Account</th><th>Last Updated</th><th>Balances</th><th>Transactions</th></tr
								></thead
							>
							<tbody class="[&>tr:hover:preset-tonal-primary">
								{#each item.accounts as account}
									<tr>
										<td>{account.name}</td>
										<td></td>
										<td
											><a href="/api/v1/balances/{account.account_id}" class="anchor"
												>Download Balances</a
											></td
										>
										<td
											><a href="/api/v1/transactions/{account.account_id}" class="anchor"
												>Download Transactions</a
											></td
										>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/snippet}
			</Accordion.Item>
		{/each}
	</Accordion>
</div>
