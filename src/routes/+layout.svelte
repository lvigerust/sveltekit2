<script lang="ts">
	import { Navbar, Toaster } from '$components'
	import '../app.css'
</script>

<svelte:head>
	<title>Filmguide</title>
</svelte:head>

<Navbar />

<div class="container px-4 2xl:px-0 pt-12">
	<slot />
</div>

<Toaster richColors />
