<script lang="ts">
	export let data
</script>

<hgroup>
	<h1 class="text-6xl text-white text-center tracking-tight font-bold">Watchlist</h1>
</hgroup>

<div>
	{#if data.watchlist}
		<ul>
			{#each data.watchlist as movie}
				<li><a href={`/movie/${movie.id}`}>{movie.title}</a></li>
			{/each}
		</ul>
	{/if}
</div>
