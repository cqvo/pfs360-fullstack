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