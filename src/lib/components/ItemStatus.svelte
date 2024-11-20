<script>
    let itemStatus = $props();
</script>

{#snippet itemStatusChip(text: string, color: string)}
    <button type="button" class="chip preset-tonal-{color}">
        {text}
    </button>
{/snippet}

{#if if itemStatus === 'Warning'}
    {@render itemStatusChip('WARN', 'warning')}
{:else if itemStatus === 'Error'}
    {@render itemStatusChip('ERROR', 'error')}
{:else if itemStatus}
    {@render itemStatusChip('OK', 'success')}
{:else}
    {@render itemStatusChip('UNK', '')}
{/if}