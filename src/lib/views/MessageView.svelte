<script lang="ts">
	import type { Snippet } from 'svelte';
	import { TriangleAlert } from '@lucide/svelte';

	// A full-page notice: setup problems and errors.
	let {
		title,
		message,
		code,
		tone = 'error',
		children
	}: { title: string; message?: string; code?: string | number; tone?: 'error' | 'warning'; children?: Snippet } = $props();
</script>

<div class="card mx-auto max-w-xl p-8 text-center">
	<div class="mx-auto grid size-12 place-items-center rounded-full {tone === 'warning' ? 'bg-warning/15 text-warning' : 'bg-destructive/15 text-destructive'}">
		<TriangleAlert class="size-5" />
	</div>
	{#if code}<p class="mt-4 font-mono text-xs text-muted-foreground">{code}</p>{/if}
	<h1 class="mt-1 text-lg font-semibold tracking-tight">{title}</h1>
	{#if message}<p class="mt-1 text-sm text-muted-foreground">{message}</p>{/if}
	{#if children}<div class="mt-6">{@render children()}</div>{/if}
</div>
