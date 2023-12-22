<script lang="ts">
	import { beforeNavigate, goto, invalidateAll } from '$app/navigation'
	import { createDropdownMenu, melt } from '@melt-ui/svelte'
	import { page } from '$app/stores'

	async function handleLogout() {
		const response = await fetch('/api/auth/logout', { method: 'DELETE' })

		if (response.ok) {
			const data = await response.json()

			if (data.success) {
				invalidateAll()
			}
		}
	}

	$: ({ user } = $page.data)

	const {
		elements: { menu, item, trigger }
	} = createDropdownMenu()
</script>

{#if !user}
	<button
		on:click={() => goto(`/login`)}
		class="focus-visible:bg-zinc-700/50 px-4 py-2 focus-visible:outline-none rounded"
	>
		Login
	</button>
{:else}
	<button
		use:melt={$trigger}
		class="focus-visible:bg-zinc-700/50 px-4 py-2 focus-visible:outline-none rounded"
		>Account</button
	>

	<div use:melt={$menu} class="bg-zinc-800 p-1.5 w-full max-w-40 rounded">
		<button use:melt={$item} on:click={() => goto(`/account`)} class="item">Profile</button>
		<button
			use:melt={$item}
			on:click={() => goto(`/account/${$page.data.user.username}/watchlist`)}
			class="item"
		>
			Watchlist
		</button>
		<button use:melt={$item} on:m-click={handleLogout} class="item">Logout</button>
	</div>
{/if}

<style lang="postcss">
	.item {
		@apply block w-full text-start cursor-pointer py-1.5 px-4 text-sm font-medium rounded transition focus-visible:outline-none hover:bg-zinc-700 focus-visible:bg-zinc-700 hover:text-white focus-visible:text-white;
	}
</style>
