import { OMDB_API_KEY, TMDB_API_KEY } from '$env/static/private'
import type { Movie } from '$lib/types.js'

export interface AccountStates {
	id: number
	favorite: boolean
	rated: { value: number }
	watchlist: boolean
}

export interface MovieDetails extends Movie {
	account_states: AccountStates
	credits: object
	'watch/providers': {
		id: number
		results: { buy: {}[]; flatrate: {}[]; rent: {}[]; link: string }[]
	}
	external_ids: { id: number; imdb_id: string }
}

export const load = async ({ fetch, params, cookies }) => {
	const movieDetails = async () => {
		const response = await fetch(
			`https://api.themoviedb.org/3/movie/${
				params.id
			}?append_to_response=account_states,credits,external_ids,images,watch/providers&api_key=${TMDB_API_KEY}&session_id=${cookies.get(
				'session'
			)}`
		)
		return (await response.json()) as MovieDetails
	}

	const imdbRating = async () => {
		const imdbID = (await movieDetails()).external_ids.imdb_id

		const omdbURL = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbID}`

		const response = await fetch(omdbURL)
		const data = await response.json()

		return data.imdbRating
	}

	return {
		movie: await movieDetails(),
		streamed: {
			imdbRating: await imdbRating()
		}
	}
}
