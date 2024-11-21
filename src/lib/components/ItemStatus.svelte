<script lang="ts">
    let { status } = $props();
</script>

{#snippet itemStatusChip(text: string, color: string)}
    <span class="chip preset-tonal-{color}">
        {text}
    </span>
{/snippet}

{#if status === 'Warning'}
    {@render itemStatusChip('WARN', 'warning')}
{:else if status === 'Error'}
    {@render itemStatusChip('ERROR', 'error')}
{:else if status === 'Active'}
    {@render itemStatusChip('OK', 'success')}
{:else}
    {@render itemStatusChip('N/A', '')}
{/if}