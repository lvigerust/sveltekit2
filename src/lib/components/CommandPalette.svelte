<script lang="ts">
	import { goto } from '$app/navigation'
	import type { Movie } from '$lib/types'
	import { slugify } from '$lib/utils'
	import { createCombobox, melt } from '@melt-ui/svelte'
	import { slide } from 'svelte/transition'

	let debounceTimer: ReturnType<typeof setTimeout>

	const debounce = (callback: () => void) => {
		clearTimeout(debounceTimer)
		debounceTimer = setTimeout(callback, 500)
	}

	const {
		elements: { menu, input, option },
		states: { open, inputValue, selected }
	} = createCombobox<Movie>()

	function search(event: KeyboardEvent) {
		if ($inputValue) {
			if ($inputValue.trim() && $inputValue.trim() !== previousQuery) {
				debounce(() => {
					getMovies()
				})
			}
		}

		if (event.key === 'Enter' && !$selected) {
			$open = !$open

			if (!$inputValue) {
				$open = false
				movies = undefined
			}
		}
	}

	let previousQuery: string
	async function getMovies() {
		const query = $inputValue.trim()
		previousQuery = query

		movies = await fetch(`/api/search/movie?query=${query}`).then((r) => r.json())
	}

	$: if ($selected) {
		$open = false
		goto(`/movie/${$selected.value.id}-${slugify($selected.value.title)}`)
	}

	let movies: Movie[] | undefined
</script>

<div class="mx-auto w-full bg-white p-2 max-w-md rounded-xl text-black">
	<div class="relative">
		<input
			use:melt={$input}
			on:keydown={search}
			autocomplete="off"
			class="w-full rounded-md border-0 bg-zinc-200 px-4 py-2.5 placeholder:text-zinc-600 focus-visible:outline-none sm:text-sm focus:ring-0"
			placeholder="Search for movie..."
		/>

		<!-- <div class="p-1.5 pl-0 flex right-0 inset-y-0 absolute">
			<kbd class="text-zinc-500 text-[14px] px-2 items-center inline-flex">⌘ K</kbd>
		</div> -->
	</div>

	{#if $open && movies?.length}
		<ul class="bg-white mt-4 p-2 rounded-xl" use:melt={$menu} in:slide>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			{#each movies as movie}
				<li
					use:melt={$option({
						value: movie,
						label: movie.title
					})}
					class=" cursor-pointer text-gray-900 rounded-md px-4 py-2.5 data-[highlighted]:bg-indigo-600 data-[highlighted]:text-white font-medium"
				>
					<div class="flex text-sm justify-between">
						<p>{movie.title}</p>
						<p>{new Date(movie.release_date).getFullYear()}</p>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>
