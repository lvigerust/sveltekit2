import { TMDB_API_KEY } from '$env/static/private'
import { PUBLIC_TMDB_BASE_URL } from '$env/static/public'
import type { ApiResponse, Movie } from '$lib/types'
import { error } from '@sveltejs/kit'

export const loadMovies = async (
	list: 'now_playing' | 'popular' | 'top_rated' | 'upcoming' = 'popular',
	page = 1
): Promise<ApiResponse<Movie>> => {
	// https://api.themoviedb.org/3/MOVIE/LIST
	const fetchURL = `${PUBLIC_TMDB_BASE_URL}movie/${list}?page=${page}&api_key=${TMDB_API_KEY}`
	const response = await fetch(fetchURL)

	if (!response.ok) {
		console.error(response.status, response.statusText)
		error(500, response.statusText)
	}

	const data: ApiResponse<Movie> = await response.json()

	return data
}
