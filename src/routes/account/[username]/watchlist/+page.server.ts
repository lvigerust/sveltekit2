import { TMDB_API_KEY } from '$env/static/private'
import type { Movie } from '$lib/types.js'

export const load = async ({ fetch, locals, cookies }) => {
	const getWatchlist = async () => {
		const user = locals.user

		const response = await fetch(
			`https://api.themoviedb.org/3/account/${user?.id}/watchlist/movies?session_id=${cookies.get(
				'session'
			)}&sort_by=created_at.desc&api_key=${TMDB_API_KEY}`
		)

		if (response.ok) {
			const watchlist = await response.json()
			return watchlist.results as Movie[]
		}
	}

	return { watchlist: await getWatchlist() }
}
