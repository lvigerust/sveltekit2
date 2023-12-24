import { TMDB_ACCESS_TOKEN } from '$env/static/private'
import { error, json, type RequestHandler } from '@sveltejs/kit'

export const DELETE: RequestHandler = async ({ fetch, cookies }) => {
	const session_id = cookies.get('session')

	const logoutURL = 'https://api.themoviedb.org/3/authentication/session'
	const options = {
		method: 'DELETE',
		headers: {
			accept: 'application/json',
			'content-type': 'application/json',
			Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`
		},
		body: JSON.stringify({ session_id })
	}

	const logoutRes = await fetch(logoutURL, options)

	if (!logoutRes.ok) {
		error(404, 'Something went wrong.')
	}

	const logoutData: { success: boolean } = await logoutRes.json()

	if (logoutData.success) {
		cookies.delete('session', { path: '/' })
		cookies.delete('request_token', { path: '/' })
		console.log('Deleted session and cookies.')
	}
	return json({ success: logoutData.success })
}
