<script lang="ts">
	let { value = $bindable(), ...props } = $props();
	const pres = () => {
		value = 'asdfasdfasdf';
	};
</script>

<input bind:value={value} {...props} />

<div class="card preset-filled-surface-100-900 border-[1px] border-surface-200-800 w-full p-4 text-center">
	{value}
</div>

<button class="btn preset-tonal-primary" onclick={pres}>Clear</button>

<style>
    input {
        font-family: 'Comic Sans MS';
        color: deeppink;
    }
</style>