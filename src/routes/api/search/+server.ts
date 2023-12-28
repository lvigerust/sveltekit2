import { TMDB_ACCESS_TOKEN } from '$env/static/private'
import type { ApiResponse } from '$lib/types'
import { json, type RequestHandler } from '@sveltejs/kit'

export interface Media {
	adult: boolean
	backdrop_path: null | string
	id: number
	title?: string
	overview: string
	poster_path: string
	media_type: 'movie' | 'tv'
	genre_ids: number[]
	popularity: number
	release_date?: Date
	video?: boolean
	vote_average: number
	vote_count: number
	name?: string
	first_air_date?: Date
}

export const GET: RequestHandler = async ({ fetch, url }) => {
	const query = url.searchParams.get('query')
	const media_type = url.searchParams.get('media_type')
	const no_filter = JSON.parse(url.searchParams.get('no_filter') ?? 'false')

	const queryURL = `https://api.themoviedb.org/3/search/${media_type}?query=${query}&include_adult=false&language=en-US&page=1`
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`
		}
	}

	const searchRes = await fetch(queryURL, options)

	if (!searchRes.ok) {
		return json({ status: searchRes.status, message: searchRes.statusText })
	}

	const searchData: ApiResponse<Media> = await searchRes.json()
	let movies, shows: Media[]

	function filterResults(list: Media[]) {
		if (no_filter) {
			return list.sort((a, b) => b.popularity - a.popularity)
		}

		const filteredResults = list
			.filter((mediaItem) => mediaItem.popularity > 20)
			.filter((mediaItem) => mediaItem.vote_count > 250)

		if (filteredResults.length) {
			return filteredResults.slice(0, 7).sort((a, b) => b.popularity - a.popularity)
		} else {
			return list.slice(0, 7).filter((mediaItem) => mediaItem.popularity > 5)
		}
	}

	switch (media_type) {
		case 'movie':
			movies = filterResults(searchData.results.map((movie) => ({ ...movie, media_type: 'movie' })))
			return json({ movies })

		case 'tv':
			shows = filterResults(searchData.results.map((show) => ({ ...show, media_type: 'tv' })))
			return json({ shows })

		default:
			movies = searchData.results.filter((i) => i.media_type === 'movie')
			shows = searchData.results.filter((i) => i.media_type === 'tv')
			return json({ movies: filterResults(movies), shows: filterResults(shows) })
	}
}
