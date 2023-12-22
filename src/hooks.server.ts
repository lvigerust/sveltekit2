import { authenticateUser } from '$lib/server/auth'
import { redirect } from '@sveltejs/kit'

export const handle = async ({ event, resolve }) => {
	const session = event.cookies.get('session')

	event.locals.user = await authenticateUser(session)

	if (event.url.pathname.startsWith('/account') && !event.locals.user) {
		redirect(303, '/login')
	}

	const response = await resolve(event)
	return response
}
