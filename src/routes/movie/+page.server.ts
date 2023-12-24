import { loadMovies } from '$lib/server/loadMovies'

export const load = async () => {
	return {
		upcoming: await loadMovies('upcoming')
	}
}
