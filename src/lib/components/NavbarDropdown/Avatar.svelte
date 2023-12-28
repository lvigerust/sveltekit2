<script lang="ts">
	import { page } from '$app/stores'
	import { imageLoader } from '$lib/utils'

	$: ({ user } = $page.data)

	$: imagesource = user?.avatar.tmdb.avatar_path ?? ''

	// const {
	// 	elements: { image, fallback }
	// } = createAvatar({
	// 	src: imageLoader(imagesource)
	// })

	$: initals = user?.name
		.split(' ')
		.map((part) => part.charAt(0).toUpperCase())
		.join('')
</script>

<div class="flex size-9 items-center justify-center rounded-full bg-zinc-800/50">
	{#if user}
		<img src={imageLoader(imagesource)} alt={initals} class="size-full rounded-[inherit]" />
	{/if}
	<!-- <span use:melt={$fallback} class="font-medium">{initals}</span> -->
</div>
