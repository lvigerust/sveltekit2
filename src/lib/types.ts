export type ApiResponse<Type> = {
	page: number
	results: Type[]
	total_pages: number
	total_results: number
}

export type User = {
	avatar: {
		gravatar: { hash: string }
		tmdb: { avatar_path: string | null }
	}
	id: number
	iso_639_1: string
	iso_3166_1: string
	name: string
	include_adult: boolean
	username: string
}

export type Movie = {
	adult: boolean
	backdrop_path: null | string
	genre_ids: number[]
	id: number
	original_language: string
	original_title: string
	overview: string
	popularity: number
	poster_path: string | null
	release_date?: string
	title: string
	video: boolean
	vote_average: number
	vote_count: number
}

export type Show = {
	backdrop_path: null | string
	first_air_date: string
	genre_ids: number[]
	id: number
	name: string
	origin_country: string[]
	original_language: string
	original_name: string
	overview: string
	popularity: number
	poster_path: string | null
	vote_average: number
	vote_count: number
}
