<script lang="ts">
	import { goto } from '$app/navigation'
	import type { Movie, Show } from '$lib/types'
	import { slugify } from '$lib/utils'
	import { createCombobox, melt } from '@melt-ui/svelte'
	import { error, type NumericRange } from '@sveltejs/kit'
	import { createEventDispatcher } from 'svelte'
	import { fade, slide } from 'svelte/transition'
	import type { Media } from '../../../routes/api/search/multi/+server'
	import { Info } from 'lucide-svelte'

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

	function search(event: KeyboardEvent) {
		if ($inputValue) {
			if ($inputValue.trim() && $inputValue.trim() !== previousQuery) {
				debounce(() => {
					getResults()
				})
			}
		}

		if (event.key === 'Enter' && !$selected) {
			$open = !$open

			if (!$inputValue) {
				$open = false
				movies = null
				shows = null
			}
		}
	}

	async function getResults() {
		let query = $inputValue.trim()
		previousQuery = query

		let mediaTypeRegex = query.match(/#(\w+)/)
		const media_Type = mediaTypeRegex ? mediaTypeRegex[1] : null

		const media_type_filter_query =
			media_Type === 'movie' || (media_Type === 'tv' ? `&media_type=${media_Type}` : '')
		const no_filter_query = media_Type === 'nofilter' ? '&nofilter=true' : ''

		query = query
			.replace(/#(\w+)/, '')
			.replace(/\s+/g, ' ')
			.trim()

		const response = await fetch(
			`/api/search/multi?query=${query}${media_type_filter_query}${no_filter_query}`
		)

		if (!response.ok) {
			error(
				response.status >= 400 && response.status <= 599
					? (response.status as NumericRange<400, 599>)
					: (404 as NumericRange<400, 599>),
				response.statusText
			)
		}

		const data = await response.json()

		movies = data.movies
		shows = data.shows
	}

	$: if ($selected) {
		const { title, name } = $selected.value
		dispatch('close')
		goto(`/${$selected.value.media_type}/${$selected.value.id}-${slugify(title || name || '')}`)
	}

	let previousQuery: string
	let movies: Movie[] | null
	let shows: Show[] | null
</script>

<div class="mx-auto w-full bg-white p-2 max-w-md rounded-xl text-black">
	<div class="relative">
		<input
			use:melt={$input}
			on:keydown={search}
			autocomplete="off"
			class="w-full rounded-md border-0 bg-zinc-200 px-4 py-2.5 placeholder:text-zinc-600 focus-visible:outline-none sm:text-sm focus:ring-0"
			placeholder="Search for a movie or TV Show..."
		/>

		{#if !$inputValue}
			<div
				class="absolute cursor-pointer top-1/2 -translate-y-1/2 right-3"
				title="Type #movie or #tv to filter results."
				transition:fade
			>
				<Info class="text-gray-500/75 w-4 h-4" />
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
