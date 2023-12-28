<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import { toast } from '$components'
	import type { Movie, Show } from '$lib/types'
	import { Bookmark } from 'lucide-svelte'
	import { fade } from 'svelte/transition'

	export let mediaItem: Movie | Show
	export let add: boolean = true

	function getMediaType(mediaItem: Movie | Show) {
		if ('title' in mediaItem) {
			return 'movie'
		} else return 'tv'
	}

	function getTitle(mediaItem: Movie | Show) {
		if ('title' in mediaItem) {
			return mediaItem.title
		} else return mediaItem.name
	}

	async function watchlist() {
		const response = await fetch(`/api/account/watchlist`, {
			method: 'POST',
			body: JSON.stringify({
				media_type: getMediaType(mediaItem),
				media_id: mediaItem.id,
				watchlist: add
			})
		}).then((r) => r.json())

		if ((await response.status) === 1 || 13) {
			invalidateAll()

			toast.success('Watchlist updated', {
				description: `${getTitle(mediaItem)} ${
					response.status === 1 ? 'added to your watchlist.' : 'was removed from your watchlist.'
				}`
			})
		}
	}
</script>

<button
	class="rounded-full h-12 p-3 bg-zinc-800/50 hover:bg-zinc-800/75 focus-visible:outline-none ring-offset-4 ring-offset-zinc-900 focus-visible:ring-2 focus-visible:ring-indigo-600/75"
	on:click={watchlist}
	title={add ? 'Add to watchlist' : 'Remove from watchlist'}
>
	{#key add}
		<span in:fade={{ delay: 150, duration: 150 }} out:fade={{ duration: 150 }}>
			{#if add}
				<Bookmark class="w-6 h-6 text-zinc-300/80" />
			{:else}
				<Bookmark class="w-6 h-6 text-rose-700 fill-rose-700" />
			{/if}
		</span>
	{/key}
</button>
