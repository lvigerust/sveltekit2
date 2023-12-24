import { PUBLIC_TMDB_IMG_URL } from '$env/static/public'
import { error } from '@sveltejs/kit'

export function slugify(text: string): string {
	// Convert to lowercase
	text = text.toLowerCase()

	// Remove special characters
	text = text.replace(/[^a-zA-Z0-9\s]/g, '')

	// Replace spaces with hyphens
	text = text.replace(/\s+/g, '-')

	// Remove consecutive hyphens
	text = text.replace(/-+/g, '-')

	// Remove leading and trailing hyphens
	text = text.replace(/^-+|-+$/g, '')

	return text
}

export function imageLoader(
	path: string,
	size:
		| 'w300'
		| 'w780'
		| 'w1280'
		| 'w92'
		| 'w154'
		| 'w185'
		| 'w342'
		| 'w500'
		| 'original' = 'original',
	type: 'backdrop' | 'poster' = 'poster'
): string {
	const allowedSizes =
		type === 'backdrop'
			? ['w300', 'w780', 'w1280', 'original']
			: ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original']

	if (!allowedSizes.includes(size)) {
		throw error(
			500,
			`Invalid size parameter. Allowed sizes for ${type}s are: ${allowedSizes.join(', ')}.`
		)
	}

	return `${PUBLIC_TMDB_IMG_URL + size}/${path}`
}
