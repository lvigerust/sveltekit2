<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import { addToast } from '$components'
	import { createDialog, melt } from '@melt-ui/svelte'
	import { createEventDispatcher } from 'svelte'
	import { fade } from 'svelte/transition'

	async function handleLogout() {
		$open = false
		const response = await fetch('/api/auth/logout', { method: 'DELETE' })

		if (response.ok) {
			const data = await response.json()

			if (data.success) {
				invalidateAll()
				addToast({
					data: {
						title: 'Success',
						description: 'You have been logged out.'
					}
				})
			}
		}
	}

	const dispatch = createEventDispatcher()

	const {
		elements: { trigger, portalled, overlay, content, title, close },
		states: { open }
	} = createDialog({
		role: 'alertdialog',
		closeOnOutsideClick: false
	})

	export let showLogoutModal: boolean
	$: $open = showLogoutModal
</script>

<button class="w-full text-start" use:melt={$trigger}> Logout </button>

<div use:melt={$portalled}>
	{#if $open}
		<div
			use:melt={$overlay}
			class="fixed inset-0 z-50 bg-black/50"
			transition:fade={{ duration: 150 }}
		/>
		<div
			use:melt={$content}
			class="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-xl bg-zinc-800 p-6 shadow-lg"
		>
			<h2 use:melt={$title}>Are you sure you want to log out?</h2>

			<div class="mt-12 flex justify-between">
				<button
					on:click={() => dispatch('close')}
					class="px-4 py-2 text-sm font-semibold bg-zinc-700 focus-visible:outline-none rounded-md focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 ring-offset-zinc-800"
				>
					No, let me stay.
				</button>
				<button
					class="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 focus-visible:outline-none rounded-md focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 ring-offset-zinc-800"
					on:click={handleLogout}
				>
					Yes, let me out!
				</button>
			</div>
		</div>
	{/if}
</div>
