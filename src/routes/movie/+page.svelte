<script lang="ts">
	import type { ApiResponse, Movie } from '$lib/types.js'
	import { imageLoader, slugify } from '$lib/utils.js'

	export let data

	let {
		upcoming: { results: upcoming }
	} = data

	let currentPage = 1

	async function handleLoadMore() {
		currentPage += 1
		const loadedMovies = await fetch(`/api/movie?page=${currentPage}`).then((r) => r.json())

		const data: ApiResponse<Movie> = loadedMovies

		upcoming = upcoming.concat(data.results)
	}
</script>

<hgroup>
	<h1 class="text-6xl text-white text-center tracking-tight font-bold">Movies</h1>
</hgroup>

<div class="py-12 pb-40">
	<div class="grid grid-flow-row grid-cols-7 gap-x-4 gap-y-5 mt-12">
		{#each upcoming as movie}
			{#if movie.poster_path}
				<a href={`/movie/${movie.id}-${slugify(movie.title)}`}>
					<img src={imageLoader(movie.poster_path, 'w342')} alt={movie.title} />
				</a>
			{/if}
		{/each}
	</div>

	<button
		on:click={handleLoadMore}
		class="mt-12 mx-auto rounded-md text-white px-4 py-2 text-sm font-medium bg-rose-600"
		>Load more</button
	>
</div>
