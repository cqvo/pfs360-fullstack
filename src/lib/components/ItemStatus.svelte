<script lang="ts">
    let { status } = $props();
</script>

{#if status === 'Error'}
<span type="button" class="chip preset-tonal-error">ERROR</span>
{:else if status === 'Warning'}
<span type="button" class="chip preset-tonal-warning">WARN</span>
{:else if status === 'Active'}
<span type="button" class="chip preset-tonal-success">OK</span>
{:else}
<span type="button" class="chip preset-tonal">UNK</span>
{/if}