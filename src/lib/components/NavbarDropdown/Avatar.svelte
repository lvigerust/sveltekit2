<script lang="ts">
	import { createAvatar, melt } from '@melt-ui/svelte'
	import { page } from '$app/stores'
	import { imageLoader } from '$lib/utils'

	$: ({ user } = $page.data)

	const {
		elements: { image, fallback }
	} = createAvatar({
		src: imageLoader(user?.avatar.tmdb.avatar_path ?? '/ry65vraImeV1UGXVgfaLH3MG5A8.jpg')
	})

	$: initals = user?.name
		.split(' ')
		.map((part) => part.charAt(0))
		.join('')
		.toUpperCase()
</script>

<div class="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-zinc-800/50">
	<img use:melt={$image} alt="Avatar" class="h-full w-full rounded-[inherit]" />
	<span use:melt={$fallback} class="font-medium">{initals}</span>
</div>
