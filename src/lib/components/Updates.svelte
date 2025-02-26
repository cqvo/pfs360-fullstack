<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	let { entries, openFirst = false } = $props();
	let value = $state([openFirst ? '0' : '']);
</script>

<Accordion {value} multiple
					 base="min-w-lg max-w-2lg mx-auto"
>
	{#each entries as entry, i}
		{@const index = i.toString()}
		<Accordion.Item value={index}
base="card preset-filled-surface-100-900 border-[1px] border-surface-200-800 w-full"
										controlBase="grid grid-cols-3 w-full"
										controlRounded="rounded-lg"
										leadBase="justify-self-start font-bold"
										indicatorBase="justify-self-end"
										panelBase="space-y-2"
		>
			{#snippet lead()}{entry.date} v{entry.title}{/snippet}
			{#snippet control()}{/snippet}
			{#snippet panel()}
				<p>{entry.content}</p>
				<ul class="list-inside list-disc">
					{#each entry.list as item}
						<li>{item}</li>
					{/each}
				</ul>
				{/snippet}
		</Accordion.Item>
	{/each}
</Accordion>