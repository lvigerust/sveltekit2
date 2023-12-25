<script lang="ts">
	import { goto } from '$app/navigation'
	import { createDropdownMenu, melt } from '@melt-ui/svelte'
	import { page } from '$app/stores'
	import Avatar from './Avatar.svelte'
	import LogoutModal from './LogoutModal.svelte'

	$: ({ user } = $page.data)

	const {
		elements: { menu, item, trigger }
	} = createDropdownMenu()

	$: showLogoutModal = false
</script>

{#if !user}
	<button
		on:click={() => goto(`/login`)}
		class="transition p-2 px-3 focus-visible:text-zinc-200 rounded-md focus-visible:outline-none focus-visible:bg-zinc-700/30"
	>
		Login
	</button>
{:else}
	<button
		use:melt={$trigger}
		class="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-full p-0.5 bg-zinc-800/50"
	>
		<Avatar />
	</button>

	<div
		use:melt={$menu}
		class="bg-zinc-800/80 backdrop-blur p-1.5 w-full max-w-40 rounded-md shadow focus-visible:outline-none"
	>
		<a use:melt={$item} href="/account" class="item">Profile</a>
		<a use:melt={$item} href={`/account/${user.username}/watchlist`} class="item"> Watchlist </a>
		<button use:melt={$item} on:m-click={() => (showLogoutModal = true)} class="item"
			><LogoutModal on:close={() => (showLogoutModal = false)} {showLogoutModal} /></button
		>
	</div>
{/if}

<style lang="postcss">
	.item {
		@apply block w-full text-start cursor-pointer py-1.5 pl-3 pr-4 text-sm font-medium rounded transition focus-visible:outline-none hover:bg-zinc-700/50 focus-visible:text-white focus-visible:bg-zinc-700/50 text-zinc-400;
	}
</style>
