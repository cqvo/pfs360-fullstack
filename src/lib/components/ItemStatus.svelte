<script>
    let { status = 'null' } = $props();
</script>

{#if status === 'Error'}
<button type="button" class="chip preset-tonal-error">ERROR</button>
{:else if status === 'Warning'}
<button type="button" class="chip preset-tonal-warning">WARN</button>
{:else if status === 'Active'}
<button type="button" class="chip preset-tonal-success">OK</button>
{:else}
<button type="button" class="chip preset-tonal">UNK</button>
{/if}

<!-- 
{#snippet itemStatusChip(text: string, color: string)}
    <button type="button" class="chip preset-tonal-{color}">
        {text}
    </button>
{/snippet}

{#if status === 'Warning'}
    {@render itemStatusChip('WARN', 'warning')}
{:else if status === 'Error'}
    {@render itemStatusChip('ERROR', 'error')}
{:else if status === 'Active'}
    {@render itemStatusChip('UNK', '')}
{:else }
    {@render itemStatusChip('OK', 'success')}
{/if} -->