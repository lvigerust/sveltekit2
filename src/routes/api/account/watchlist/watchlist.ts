import { invalidateAll } from '$app/navigation'

export async function watchlist(media_type: string, media_id: number, watchlist: boolean) {
	const response = await fetch(`/api/account/watchlist`, {
		method: 'POST',
		body: JSON.stringify({ media_type, media_id, watchlist })
	}).then((r) => r.json())

	if (await response.success) {
		invalidateAll()
	}
}
