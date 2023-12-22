import { TMDB_ACCESS_TOKEN } from '$env/static/private'
import { json } from '@sveltejs/kit'

export const POST = async ({ fetch, cookies, request }) => {
	const requestData = await request.json()

	const { media_type, media_id, watchlist } = requestData

	const watchlistURL = `https://api.themoviedb.org/3/account/8629851/watchlist?session_id=${cookies.get(
		'session'
	)}`
	const options = {
		method: 'POST',
		headers: {
			accept: 'application/json',
			'content-type': 'application/json',
			Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`
		},
		body: JSON.stringify({ media_type, media_id, watchlist })
	}

	const response = await fetch(watchlistURL, options)

	if (response.ok) {
		return json({ success: true })
	} else console.error(response.status, response.statusText)

	return new Response()
}
