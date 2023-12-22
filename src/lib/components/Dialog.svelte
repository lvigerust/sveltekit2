<script lang="ts">
	import { onNavigate } from '$app/navigation'
	import { CommandPalette } from '$components'
	import { createDialog, melt } from '@melt-ui/svelte'
	import { fade, fly } from 'svelte/transition'
	import { Search } from 'lucide-svelte'

	const {
		elements: { trigger, overlay, content, portalled },
		states: { open }
	} = createDialog()

	onNavigate(() => {
		$open = false
	})

	function handleOpen(e: KeyboardEvent) {
		if (e.key === '.' && (e.metaKey || e.ctrlKey)) {
			$open = true
		}
	}
</script>

<svelte:window on:keydown={handleOpen} />

<button
	use:melt={$trigger}
	class="transition hover:bg-zinc-700/50 p-2.5 rounded-full focus-visible:outline-none focus-visible:bg-zinc-700/50"
>
	<Search class="h-5 w-5" />
</button>

<div use:melt={$portalled}>
	{#if $open}
		<div
			use:melt={$overlay}
			class="fixed inset-0 z-50 backdrop-blur"
			in:fade={{ duration: 300 }}
			out:fade={{ duration: 150 }}
		/>
		<div
			class="fixed px-4 sm:px-0 left-[50%] max-w-xl w-full top-[32.5%] z-50 translate-x-[-50%] translate-y-[-50%]"
			use:melt={$content}
			in:fly={{ y: 10, delay: 200 }}
			out:fade={{ duration: 100 }}
		>
			<div>
				<CommandPalette />
				<p class="text-center font-medium mt-6 text-sm select-none">Or press anywhere to close</p>
			</div>
		</div>
	{/if}
</div>
