<div class="page flex h-screen items-center justify-center">
	<div
		class="card w-full max-w-2xl border-[1px] p-4 text-center border-surface-200-800 preset-filled-surface-100-900"
	>
		<form class="space-x-4 space-y-4" action="/auth/callback/credentials" method="POST">
			<input type="hidden" name="csrfToken" />
			<div class="space-y-4">
				<div>
					<label class="label" for="input-email-for-credentials-provider">Email</label><input
						class="w-full max-w-sm"
						name="email"
						id="input-email-for-credentials-provider"
						type="text"
					/>
				</div>
				<div>
					<label class="label" for="input-password-for-credentials-provider"
						><span class="">Password</span></label
					><input
						class="w-full max-w-sm"
						name="password"
						id="input-password-for-credentials-provider"
						type="password"
					/>
				</div>
			</div>
			<button class="btn preset-filled-primary-500" id="submitButton" type="submit" tabindex="0"
				>Sign in with Credentials</button
			>
		</form>
	</div>
</div>
