import { TMDB_API_KEY } from '$env/static/private'
import type { Movie } from '$lib/types.js'

export const load = async ({ fetch, params }) => {
	const response = await fetch(
		`https://api.themoviedb.org/3/movie/${params.id}?api_key=${TMDB_API_KEY}`
	)

	const data: Movie = await response.json()

	return data
}
