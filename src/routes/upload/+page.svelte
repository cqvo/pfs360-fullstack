<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<div>
	<form method="POST" use:enhance enctype="multipart/form-data" action="?/uploadCsv">
		<div class="group">
		  <label for="file">Upload your file</label>
		  <input
			type="file"
			id="file"
			name="fileToUpload"
			required
		  />
		</div>
	  
		<button class="btn preset-tonal-primary" type="submit">Submit</button>
	  </form>
</div>