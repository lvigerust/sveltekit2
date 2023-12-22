import { TMDB_ACCESS_TOKEN } from '$env/static/private'
import type { User } from '$lib/types'

export const authenticateUser = async (session: string | undefined): Promise<User | null> => {
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
			// console.log('User', accountDetailsData.username, 'authenticated.')

			return accountDetailsData
		} else {
			console.error(accountDetailsRes.status, accountDetailsRes.statusText)
			return null
		}
	}

	return null
}
