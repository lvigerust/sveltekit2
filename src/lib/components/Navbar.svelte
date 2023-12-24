<script lang="ts">
	import { Dialog, Dropdown } from '$components'
	import { page } from '$app/stores'

	$: ({ user } = $page.data)

	const menuItems: { label: string; href: string }[] = [
		{
			label: 'Movies',
			href: '/movie'
		},
		{
			label: 'TV Shows',
			href: '/tv'
		}
	]
</script>

<nav class="h-16 flex items-center justify-between text-sm font-semibold container px-4 2xl:px-0">
	<div class="navbar-start w-1/2">
		<a
			tabindex="-1"
			href="/"
			class="transition focus-visible:outline-none hover:text-white focus-visible:text-white text-base"
			>Filmguide</a
		>
	</div>

	<div class="navbar-center flex-shrink-0">
		<ul class="flex gap-x-4 justify-center">
			{#each menuItems as { label, href }}
				<li>
					<a
						{href}
						class="transition hover:text-white p-2 px-3 focus-visible:text-zinc-200 rounded-md focus-visible:outline-none focus-visible:bg-zinc-700/30"
						>{label}</a
					>
				</li>
			{/each}

			{#if user}
				<li>
					<a
						href={`/account/${user.username}/watchlist`}
						class="transition hover:text-white p-2 px-3 focus-visible:text-zinc-200 rounded-md focus-visible:outline-none focus-visible:bg-zinc-700/30"
						>Watchlist</a
					>
				</li>
			{/if}
		</ul>
	</div>

	<div class="navbar-end w-1/2 justify-end items-center gap-x-4 flex">
		<div>
			<Dialog />
		</div>
		<div>
			<Dropdown />
		</div>
	</div>
</nav>
