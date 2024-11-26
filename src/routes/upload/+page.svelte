<script lang="ts">
	import { enhance } from '$app/forms';
	import { Modal, FileUpload, type FileUploadApi } from '@skeletonlabs/skeleton-svelte';
	import IconUpload from 'lucide-svelte/icons/upload';
	import IconDropzone from 'lucide-svelte/icons/image-plus';
	import IconFile from 'lucide-svelte/icons/paperclip';
	import IconRemove from 'lucide-svelte/icons/circle-x';

	let apiRef: FileUploadApi;
	let files: File[] = [];

	let uploadResponseState = $state(false);
	let uploadResponse;
	const uploadResponseHandler = (result) => {
		if (result) {
			uploadResponseState = true;
			uploadResponse = result;
			setTimeout(() => {
				uploadResponseState = false;
				uploadResponse = null;
			}, 3000);
		}
	};

	const uploadFiles = async (files: File[]) => {
		for (const file of files) {
			console.log('uploadFiles() - Uploading:', file);
			const formData = new FormData();
			formData.append('fileToUpload', file);
			try {
				const response = await fetch('?/uploadFile', {
					method: 'POST',
					body: formData
				});
				const result = await response.json();
			} catch (error) {
				console.error('uploadFiles() - Error uploading file:', error);
			}
		}
	};
	const handleFiles = (details: FileChangeDetails) => {
		files = details.acceptedFiles;
		console.log('handleFiles() - Files ready to upload:', files);
	};
</script>

<main>
	<article class="mx-auto min-w-72 p-4 md:w-1/2">
		<Modal bind:open={uploadResponseState}
			contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
			backdropClasses="backdrop-blur-sm"
			>
			{#snippet content()}
			<header class="flex justify-between">
				<h2 class="h2">
					{#if uploadResponse.success === true}
						Success
					{:else}
						Error
					{/if}
				</h2>
			</header>
			<article><p class="opacity-60">{uploadResponse.message}</p></article>
			{/snippet}
		</Modal>
		<form method="post" action="?/uploadFile" use:enhance={
			() => {
				return async ({ result }) => {
					console.log(result);
					uploadResponseHandler(result);
				}
			}
		} >
			<div class="mb-4">
		<section class="px-4 py-2">
			<FileUpload
				name="example"
				accept="text/csv"
				maxFiles={1}
				subtext="Attach up to 1 CSV file."
				onFileChange={handleFiles}
				onFileReject={console.error}
				classes="w-full"
				bind:internalApi={apiRef}
			>
				{#snippet iconInterface()}<IconDropzone class="size-8" />{/snippet}
				{#snippet iconFile()}<IconFile class="size-4" />{/snippet}
				{#snippet iconFileRemove()}<IconRemove class="size-4" />{/snippet}
			</FileUpload>
		</section>
		<section class="gap-4 px-4">
			<button type="button" onclick={() => uploadFiles(files)} class="btn preset-filled-primary-500"
				>Upload</button
			>
		</section>
	</form>
	</article>
</main>
<!-- <div>
	<form method="post" use:enhance enctype="multipart/form-data">
		<div >
		  <label for="file">Upload your file</label>
		  <input  class="btn preset-tonal-primary"
			type="file"
			id="file"
			name="fileToUpload"
			required
		  />
		</div>
	  
		<button class="btn preset-filled-primary-500" type="submit">Upload</button>
	  </form>
	  <button type="button" class="btn preset-tonal-primary" onclick={apiRef.clearFiles}>Clear Files</button>
</div> -->
