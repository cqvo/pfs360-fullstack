<script lang="ts">
    let { status } = $props();
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
    <span class="chip preset-tonal-{color}">
        {text}
    </span>
{/snippet}

{#if status === 'Warning'}
{#if status === 'Warning'}
    {@render itemStatusChip('WARN', 'warning')}
{:else if status === 'Error'}
{:else if status === 'Error'}
    {@render itemStatusChip('ERROR', 'error')}
{:else if status === 'Active'}
    {@render itemStatusChip('OK', 'success')}
{:else}
    {@render itemStatusChip('N/A', '')}
{/if}