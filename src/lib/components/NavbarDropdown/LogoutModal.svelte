<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import { toast } from '$components'
	import { createDialog, melt } from '@melt-ui/svelte'
	import { LogOut } from 'lucide-svelte'
	import { createEventDispatcher } from 'svelte'
	import { fade, fly } from 'svelte/transition'

	async function handleLogout() {
		$open = false
		const response = await fetch('/api/auth/logout', { method: 'DELETE' })

		if (response.ok) {
			const data = await response.json()

			if (data.success) {
				invalidateAll()
				toast('Success', {
					description: 'You have been logged out.'
				})
			}
		}
	}

	const dispatch = createEventDispatcher()

	const {
		elements: { trigger, portalled, overlay, content, title, description },
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
			class="fixed inset-0 z-50 bg-black/10 backdrop-blur"
			transition:fade={{ duration: 150 }}
		/>
		<div
			use:melt={$content}
			in:fly={{ y: 15 }}
			class="fixed left-[50%] top-[50%] flex items-center text-center flex-col z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-xl bg-zinc-800 p-6 shadow-lg ring-1 ring-zinc-600/25"
		>
			<div class="mb-6 bg-zinc-700/40 rounded-full p-4 ring-1 ring-zinc-100/10">
				<LogOut class="size-5" />
			</div>

			<h2 use:melt={$title} class="font-medium text-zinc-50 mb-2">Leave the movie magic behind?</h2>
			<p use:melt={$description} class="text-sm text-zinc-400/90 max-w-md">
				We're shedding a tear as you make your grand exit, but hey, our doors (and funny jokes) are
				always open for your triumphant return!
			</p>

			<div class="mt-8 flex gap-x-4 w-full">
				<button
					on:click={() => dispatch('close')}
					class="px-4 py-2 text-sm font-medium focus-visible:outline-none ring-1 ring-zinc-100/10 flex-1 rounded-md focus-visible:ring-2 focus-visible:ring-indigo-600"
				>
					I'll stay for the jokes.
				</button>
				<button
					class="px-4 py-2 text-sm flex-1 font-medium text-white bg-indigo-600 focus-visible:outline-none rounded-md focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 ring-offset-zinc-800"
					on:click={handleLogout}
				>
					Please let me out.
				</button>
			</div>
		</div>
	{/if}
</div>
