<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import { addToast } from '$components'
	import type { Movie, Show } from '$lib/types'

	export let mediaItem: Movie | Show
	export let add: boolean = true

	export let className = 'px-4 py-2 rounded-md text-sm font-semibold bg-indigo-600 text-white'

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

	$: buttonText = add ? 'Add to watchlist' : 'Remove from watchlist'

	async function watchlist() {
		buttonText = add ? 'Adding...' : 'Removing...'
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
			addToast({
				data: {
					title: 'Watchlist updated',
					description: `${getTitle(mediaItem)} ${
						response.status === 1 ? 'added to your watchlist.' : 'was removed from your watchlist.'
					}`
				}
			})
		}
	}
</script>

<button class={className} on:click={watchlist}>
	{buttonText}
</button>
