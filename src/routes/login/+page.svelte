<script lang="ts">
	export let data
</script>

<div class="flex flex-col items-center gap-8">
	<hgroup>
		<h1 class="text-6xl text-white text-center tracking-tight font-bold">Login</h1>
	</hgroup>

	<a
		href={`${data.approveTokenLink}`}
		class="px-4 bg-emerald-600 text-white text-sm font-semibold py-2 rounded">Approve</a
	>
</div>
