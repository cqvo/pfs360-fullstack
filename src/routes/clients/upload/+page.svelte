<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<div>
	<!-- <FileUpload name="uploadClients" accept="text/csv" onFileChange={console.log} maxFiles={1}>
		<button class="btn preset-filled">
			<IconUpload class="size-4" />
			<span>Select File</span>
		</button>
	</FileUpload> -->
	<form method="post" use:enhance enctype="multipart/form-data">
		<div class="group">
		  <label for="file">Upload your file</label>
		  <input
			type="file"
			id="file"
			name="fileToUpload"
			required
		  />
		</div>
	  
		<button type="submit">Submit</button>
	  </form>
</div>