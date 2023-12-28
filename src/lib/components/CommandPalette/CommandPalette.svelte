<script lang="ts">
	import { goto } from '$app/navigation'
	import type { Movie, Show } from '$lib/types'
	import { slugify } from '$lib/utils'
	import { createCombobox, melt } from '@melt-ui/svelte'
	import { createEventDispatcher } from 'svelte'
	import { fade, slide } from 'svelte/transition'
	import type { Media } from '../../../routes/api/search/+server'

	const {
		elements: { menu, input, option },
		states: { open, inputValue, selected }
	} = createCombobox<Media>()

	const dispatch = createEventDispatcher()

	let debounceTimer: ReturnType<typeof setTimeout>
	const debounce = (callback: () => void) => {
		clearTimeout(debounceTimer)
		debounceTimer = setTimeout(callback, 500)
	}

	async function search() {
		let query = $inputValue.trim()

		if (query !== previousQuery) {
			if (!query) {
				previousQuery = ''
				movies = null
				shows = null
				return
			}
			previousQuery = query

			const hashtags = query.match(/#\w+/g)
			const nofilter = hashtags?.find((item) => item === '#nofilter') ? true : false
			const media_type =
				hashtags?.find((item) => item === '#movie' || item === '#tv')?.slice(1) ?? 'multi'

			query = query
				.replace(/#(\w+)/g, '')
				.replace(/\s+/g, ' ')
				.trim()

			console.log('Fetching:', query)

			const response = await fetch(
				`/api/search?query=${query}&media_type=${media_type}&no_filter=${nofilter}`
			)

			const data = await response.json()

			movies = data.movies
			shows = data.shows
		}
	}

	$: if ($selected) {
		const { title, name, media_type } = $selected.value
		dispatch('close')
		goto(`/${media_type}/${$selected.value.id}-${slugify(title || name || '')}`)
	}

	let previousQuery: string
	let movies: Movie[] | null
	let shows: Show[] | null

	// Test ground
	$: tags = $inputValue.match(/#\w+/g)

	let newTags: string[] = ['movie']

	let tag: string = ''

	function removeTag(index: number) {
		newTags.splice(index, 1)
	}

	function addTag() {
		let v = tag.trim()
		if (v === '') {
			return
		}
		newTags = [...newTags, v]
		tag = ''
	}
</script>

<div class="mx-auto w-full bg-white p-2 max-w-md rounded-xl text-black">
	<div class="relative">
		<input
			use:melt={$input}
			on:keydown={() =>
				debounce(() => {
					search()
				})}
			autocomplete="off"
			class="w-full rounded-md border-0 bg-zinc-200 px-4 py-2.5 placeholder:text-zinc-600 focus-visible:outline-none sm:text-sm focus:ring-0"
			placeholder="Search for a movie or TV Show..."
		/>

		{#if tags}
			<div class="absolute top-1/2 -translate-y-1/2 right-3 flex gap-1" transition:fade>
				{#each tags as tag}
					<span
						class="rounded-full bg-indigo-100 px-3 py-1 select-none text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
						>{tag.slice(1)}</span
					>
				{/each}

				<!-- <Info class="text-gray-500/75 size-4" /> -->

				<!-- <kbd class="tracking-tighter text-sm">⌘ + K</kbd> -->
			</div>
		{/if}
	</div>

	{#if ($open && movies?.length) || shows?.length}
		<ul
			class="bg-white mt-4 p-2 rounded-xl max-h-[28rem] scroll-py-2 scroll-pt-12 overflow-y-auto"
			use:melt={$menu}
			transition:slide
		>
			{#if movies?.length}
				<li>
					<h2 class="text-xs font-semibold px-3 mt-4 mb-2 text-gray-500">
						{movies.length > 1 ? 'Movies' : 'Movie'}
					</h2>
					<ul>
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

									{#if movie.release_date}
										<p>{new Date(movie.release_date).getFullYear()}</p>
									{:else}
										<p>N/A</p>
									{/if}
								</div>
							</li>
						{/each}
					</ul>
				</li>
			{/if}

			{#if shows?.length}
				<li>
					<h2 class="text-xs font-semibold px-3 mt-4 mb-2 text-gray-500">
						{shows.length > 1 ? 'TV Shows' : 'TV Show'}
					</h2>
					<ul>
						{#each shows as show}
							<li
								use:melt={$option({
									value: show,
									label: show.name
								})}
								class=" cursor-pointer text-gray-900 rounded-md px-4 py-2.5 data-[highlighted]:bg-indigo-600 data-[highlighted]:text-white font-medium"
							>
								<div class="flex text-sm justify-between">
									<p>{show.name}</p>
									<p>{new Date(show.first_air_date).getFullYear()}</p>
								</div>
							</li>
						{/each}
					</ul>
				</li>
			{/if}
		</ul>
	{/if}
</div>
