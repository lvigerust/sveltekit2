import { invalidateAll } from '$app/navigation'
import { TMDB_ACCESS_TOKEN } from '$env/static/private'
import type { User } from '$lib/types'
import type { RequestEvent } from '@sveltejs/kit'

export const authenticateUser = async (event: RequestEvent): Promise<User | null> => {
	const { cookies, fetch } = event
	const session = cookies.get('session')

	const url = `https://api.themoviedb.org/3/account?session_id=${session}`
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`
		}
	}

	if (session) {
		const accountDetailsRes = await fetch(url, options)

		if (accountDetailsRes.ok) {
			const accountDetailsData: User = await accountDetailsRes.json()
			return accountDetailsData
		} else {
			cookies.delete('session', { path: '/' })
			console.error(accountDetailsRes.status, accountDetailsRes.statusText)
		}
	}

	return null
}
