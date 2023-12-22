<script lang="ts">
	import { watchlist } from '../../api/account/watchlist/watchlist.js'

	export let data

	$: ({
		movie,
		movie: { account_states },
		movie: { credits },
		user
	} = data)

	$: watchProviders = movie['watch/providers'].results
</script>

<hgroup>
	<h1 class="text-6xl text-white text-center tracking-tight font-bold">{movie.title}</h1>
</hgroup>

{#if user}
	<button
		on:click={() => watchlist('movie', movie.id, !account_states?.watchlist)}
		class="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded"
	>
		{account_states?.watchlist ? 'Remove from watchlist' : 'Add to watchlist'}
	</button>
{/if}
