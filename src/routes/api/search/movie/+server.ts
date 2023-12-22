import { TMDB_ACCESS_TOKEN } from '$env/static/private'
import type { ApiResponse, Movie } from '$lib/types'
import { error, json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ fetch, url }) => {
	const query = url.searchParams.get('query')

	console.log('Searching for:', query)

	const queryURL = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`
		}
	}

	const searchRes = await fetch(queryURL, options)

	if (!searchRes.ok) {
		error(404, searchRes.statusText)
	}

	const searchData: ApiResponse<Movie> = await searchRes.json()

	const filteredData = searchData.results
		.sort((a, b) => b.popularity - a.popularity)
		.filter((movie) => movie.popularity > 25)
		.filter((movie) => movie.vote_count > 250)

	if (filteredData.length) {
		return json(filteredData)
	} else {
		return json(
			searchData.results
				.sort((a, b) => b.popularity - a.popularity)
				.filter((movie) => movie.popularity > 25)
		)
	}
}
