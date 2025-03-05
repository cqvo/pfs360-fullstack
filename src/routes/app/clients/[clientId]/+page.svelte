<script lang="ts">
	import type { PageProps } from './$types';
	import { getContext, onMount, setContext } from 'svelte';
	import { enhance } from '$app/forms';
	import { Accordion, type ToastContext } from '@skeletonlabs/skeleton-svelte';
	import { ROLES, hasPermission } from '$lib/UserPermissions';
	import PlaidLink from '$lib/components/PlaidLink.svelte';

	let { data }: PageProps = $props();
	let enableRequestData = $state(true);
	let accordionState = $state([]);

	const user = getContext('user');
	const hasRequester = hasPermission(user.role, ROLES.REQUESTER);

	const triggerRequestData = (success) => {
		toast.create({ description: 'New data requested.'})
	}

	const disableRequestData = () => {
		enableRequestData = false;
	};

	export const toast: ToastContext = getContext('toast');

	$inspect(data);
</script>

<h1 class="h1">{data.companyName}</h1>
<PlaidLink />

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
						<button type="submit" class="btn preset-tonal-primary {enableRequestData && hasRequester ? '' : 'disabled'}" onclick={disableRequestData}> Request New Data </button>
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
