<script lang="ts" context="module">
	export type ToastData = {
		title: string
		description: string
	}

	const {
		elements: { content, title, description, close },
		helpers,
		states: { toasts },
		actions: { portal }
	} = createToaster<ToastData>()

	export const addToast = helpers.addToast
</script>

<script lang="ts">
	import { createToaster, melt } from '@melt-ui/svelte'
	import { CheckCircle2, X } from 'lucide-svelte'
	import { flip } from 'svelte/animate'
	import { fly } from 'svelte/transition'
</script>

<div
	class="fixed right-0 top-0 z-50 m-4 flex flex-col items-end gap-2 md:bottom-0 md:top-auto"
	use:portal
>
	{#each $toasts as { id, data } (id)}
		<div
			use:melt={$content(id)}
			animate:flip={{ duration: 500 }}
			in:fly={{ duration: 150, x: '100%' }}
			out:fly={{ duration: 150, x: '100%' }}
			class="rounded-lg bg-zinc-800/90 backdrop-blur text-white shadow-md w-[24rem] max-w-[calc(100vw-2rem)] p-4"
		>
			<div class="flex items-start w-full">
				<div class="shrink-0">
					<CheckCircle2 class="h-5 w-5 text-green-600" />
				</div>

				<div class="flex-1 ml-3">
					<p use:melt={$title(id)} class="font-medium text-sm text-white">
						{data.title}
					</p>

					<p use:melt={$description(id)} class="mt-1 text-sm text-zinc-400">
						{data.description}
					</p>
				</div>

				<div class="ml-4 flex shrink-0">
					<button
						use:melt={$close(id)}
						class=" inline-flex text-zinc-400 hover:text-zinc-200 transition focus-visible:outline-none focus-visible:bg-zinc-700/30 focus-visible:text-zinc-300/90 rounded p-0.5 focus-visible:ring-1 focus-visible:ring-zinc-100/10"
						aria-label="close notification"
					>
						<X class="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>
	{/each}
</div>
