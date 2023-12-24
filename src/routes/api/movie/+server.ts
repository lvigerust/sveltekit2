import { loadMovies } from '$lib/server/loadMovies.js'
import { json } from '@sveltejs/kit'

export const GET = async ({ url }) => {
	const page = Number(url.searchParams.get('page')) ?? 1

	const response = await loadMovies('upcoming', page)

	return json(response)
}
