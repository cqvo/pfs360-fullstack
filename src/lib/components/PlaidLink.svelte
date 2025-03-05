<script lang="ts">
	import { onMount } from 'svelte';
	import { LoaderCircle } from 'lucide-svelte';
	import { invalidateAll } from '$app/navigation';
	import { createLogger } from '$lib/server/LoggerFactory';

	let Plaid = $state();
	let handler = $state();
	let isSdkLoaded = $state(false);
	let loadingFlag = $state(false);

	const logger = createLogger({ component: 'PlaidLink.svelte'});

	const loadPlaidSdk = () => {
		try {
			const script = document.createElement('script');
			script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
			script.async = true;
			document.body.appendChild(script);
		} catch (error) {
			logger.error('Failed to load Plaid SDK:', error);
		}
	};

	const waitForSdk = async (maxRetries = 10, retryInterval = 100) => {
		let retryCount = 0;
		while (retryCount < maxRetries) {
			if (window.Plaid) return true;
			retryCount++;
			const backoffTime = retryInterval * Math.pow(1.5, retryCount - 1);
			await new Promise((resolve) => setTimeout(resolve, backoffTime));
		}
		logger.error('Plaid SDK failed to load');
		return false;
	};

	const initializePlaid = async () => {
		isSdkLoaded = await waitForSdk();
		if (!isSdkLoaded) return;
		Plaid = window.Plaid;
		const linkToken = await fetchToken();
		handler = Plaid.create({
			token: linkToken,
			onLoad: () => {
				openPlaid();
			},
			onSuccess: async (publicToken, metadata) => {
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
				await invalidateAll();
			},
			onExit: (err, metadata) => {},
			onEvent: (eventName, metadata) => {
				if (eventName === 'OPEN') {
					loadingFlag = false;
				}
			}
		});
	};

	const fetchToken = async () => {
		const response = await fetch('?/newToken', {
			method: 'POST',
			body: '',
			headers: {
				'x-sveltekit-action': 'true'
			}
		});
		const result = await response.json();
		const parsed = JSON.parse(result.data);
		return parsed[2];
	};

	const openPlaid = () => {
		if (!handler) {
			loadingFlag = true;
			initializePlaid();
		} else {
			handler.open();
		}
	};

	onMount(() => {
		loadPlaidSdk();
	});
</script>

<div class="max-w-fit">
	<button
		type="button"
		class="btn w-full preset-filled-primary-500 {loadingFlag ? 'disabled' : ''}"
		onclick={openPlaid}
	>
		{#if loadingFlag}
			<LoaderCircle strokeWidth={3} class="animate-spin opacity-60" /> Loading...
		{:else}
			Link New Bank
		{/if}
	</button>
</div>
