import type { User } from '$types'

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null
		}
		interface PageData {
			user: User | null
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
