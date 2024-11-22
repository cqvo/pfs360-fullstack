<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<div>
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