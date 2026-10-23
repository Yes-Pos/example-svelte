<script lang="ts">
	import type { Component, Snippet } from 'svelte';

	let {
		icon: Icon,
		title,
		description,
		children
	}: { icon: Component; title: string; description?: string; children?: Snippet } = $props();
</script>

<div class="rounded-3xl border border-dashed border-border-strong px-6 py-16 text-center">
	<div class="mx-auto grid size-14 place-items-center rounded-full bg-muted">
		<Icon class="size-6 text-muted-foreground" />
	</div>
	<p class="mt-4 font-medium">{title}</p>
	{#if description}<p class="mt-1 text-sm text-muted-foreground">{description}</p>{/if}
	{#if children}<div class="mt-6">{@render children()}</div>{/if}
</div>
