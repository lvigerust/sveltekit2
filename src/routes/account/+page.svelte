<script lang="ts">
	export let data

	$: ({ user } = data)
</script>

<div class="flex flex-col items-center gap-8">
	<hgroup>
		<h1 class="text-6xl text-white text-center tracking-tight font-bold">{user?.name}</h1>
	</hgroup>
</div>
