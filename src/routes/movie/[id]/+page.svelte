<script lang="ts">
	import AddWatchlist from './AddWatchlist.svelte'

	export let data

	$: ({
		movie,
		movie: { account_states },
		movie: { credits },
		streamed: { imdbRating },
		user
	} = data)

	$: watchProviders = movie['watch/providers'].results
</script>

<hgroup>
	<h1 class="text-6xl text-white text-center tracking-tight font-bold">{movie.title}</h1>
</hgroup>

{#if user}
	<AddWatchlist mediaItem={movie} add={!account_states.watchlist} />
{/if}
