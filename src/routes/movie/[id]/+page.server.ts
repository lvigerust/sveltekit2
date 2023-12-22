import { TMDB_API_KEY } from '$env/static/private'
import type { Movie } from '$lib/types.js'

interface AccountStates {
	id: number
	favorite: boolean
	rated: { value: number }
	watchlist: boolean
}

interface MovieDetails extends Movie {
	account_states: AccountStates
	credits: object
	'watch/providers': {
		id: number
		results: { buy: {}[]; flatrate: {}[]; rent: {}[]; link: string }[]
	}
}

export const load = async ({ fetch, params, cookies }) => {
	const movieDetails = async () => {
		const response = await fetch(
			`https://api.themoviedb.org/3/movie/${
				params.id
			}?append_to_response=account_states,credits,watch/providers&api_key=${TMDB_API_KEY}&session_id=${cookies.get(
				'session'
			)}`
		)
		return (await response.json()) as MovieDetails
	}

	return {
		movie: await movieDetails()
	}
}
