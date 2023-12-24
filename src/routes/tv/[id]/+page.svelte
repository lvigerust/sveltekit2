<script lang="ts">
	import { imageLoader } from '$lib/utils.js'

	export let data

	let { show } = data
</script>

<img src={imageLoader(show.backdrop_path, 'w780', 'backdrop')} alt={show.name} />
