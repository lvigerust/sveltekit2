import { TMDB_ACCESS_TOKEN } from '$env/static/private'
import { error, redirect } from '@sveltejs/kit'

type RequestToken = {
	success: boolean
	expires_at: string
	request_token: string
}

type Session = {
	success: boolean
	session_id: string
}

export const load = async ({ fetch, cookies, url }) => {
	const session = cookies.get('session')
	const requestToken = cookies.get('request_token')

	const requestTokenApproved =
		url.searchParams.get('request_token') == requestToken &&
		url.searchParams.get('approved') == 'true'

	if (!requestTokenApproved && !session) {
		if (requestToken) {
			return {
				approveTokenLink: `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=${url.origin}/login`
			}
		} else {
			console.log('Getting request token...')
			const apiUrl = 'https://api.themoviedb.org/3/authentication/token/new'
			const options = {
				method: 'GET',
				headers: {
					accept: 'application/json',
					Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`
				}
			}
			const tokenRes = await fetch(apiUrl, options)
			if (!tokenRes.ok) {
				error(404, tokenRes.statusText)
			}
			const tokenData: RequestToken = await tokenRes.json()
			if (tokenData.success) {
				cookies.set('request_token', tokenData.request_token, { path: '/', maxAge: 60 * 60 })
				return {
					approveTokenLink: `https://www.themoviedb.org/authenticate/${tokenData.request_token}?redirect_to=${url.origin}/login`
				}
			}
		}
	} else if (!session) {
		console.log('Request token approved, creating session...')
		const sessionURL = 'https://api.themoviedb.org/3/authentication/session/new'
		const options = {
			method: 'POST',
			headers: {
				accept: 'application/json',
				'content-type': 'application/json',
				Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`
			},
			body: JSON.stringify({ request_token: cookies.get('request_token') })
		}
		const sessionRes = await fetch(sessionURL, options)
		if (!sessionRes.ok) {
			error(404, 'Something went wrong.')
		}
		const sessionData: Session = await sessionRes.json()
		if (sessionData.success) {
			cookies.set('session', sessionData.session_id, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_env === 'production',
				maxAge: 60 * 60 * 24 * 30
			})
			console.log('Logged in.')

			redirect(303, '/account')
		}
	} else redirect(301, '/account')
}
