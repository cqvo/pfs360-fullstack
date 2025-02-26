<script lang="ts">
	import { enhance } from '$app/forms';

	const exampleCsv = [
		{
			taxdomeId: 'LDT250',
			companyName: 'Oscorp Industries',
			email: 'norman@oscorp.com'
		},
		{
			taxdomeId: 'VVP204',
			companyName: 'Umbrella Corporation',
			email: 'awesker@umbrella.co.jp'
		},
		{
			taxdomeId: 'MFD288',
			companyName: 'Spacely Space Sprockets',
			email: 'cosmo@spacely.com'
		},
		{
			taxdomeId: 'AWV952',
			companyName: 'CHOAM',
			email: 'malina.aru@choam.org'
		},
		{
			taxdomeId: 'NLY936',
			companyName: 'Wayne Enterprises',
			email: 'lucius.fox@wayneenterprises.com'
		}
	];
</script>

<section
	class="card mx-auto w-full max-w-md border-[1px] p-4 border-surface-200-800 preset-filled-surface-100-900"
>
	<form
		class="space-y-4"
		method="POST"
		use:enhance
		enctype="multipart/form-data"
		action="?/uploadCsv"
	>
		<h5 class="h5">Upload your file</h5>
		<label for="file" class="label">
			<input type="file" id="file" name="fileToUpload" required />
			<div class="flex"><span class="label-text">Taxdome CSV</span></div>
		</label>

		<button class="btn preset-filled-primary-500" type="submit">Submit</button>
	</form>
</section>

<section class="mx-auto">
	<p>The file being uploaded MUST be a .CSV (comma-separated values) file without headers.</p>
	<p>
		Each row should have the Taxdome ID, client business name, and client email address, in that
		order.
	</p>
</section>

<section class="table-wrap mx-auto max-w-xl">
	<table class="table caption-top">
		<caption>Example CSV</caption>
		<tbody>
			{#each exampleCsv as row}
				<tr class="hover:preset-tonal-primary">
					<td>{row.taxdomeId}</td>
					<td>{row.companyName}</td>
					<td>{row.email}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>
