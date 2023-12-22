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
