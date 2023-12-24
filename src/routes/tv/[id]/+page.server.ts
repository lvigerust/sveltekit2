import { TMDB_API_KEY } from '$env/static/private'

export const load = async ({ fetch, params }) => {
	const response = await fetch(
		`https://api.themoviedb.org/3/tv/${params.id}?api_key=${TMDB_API_KEY}`
	)

	const data = await response.json()

	return { show: data }
}
