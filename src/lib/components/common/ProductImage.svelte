<script lang="ts">
	import { ImageOff } from '@lucide/svelte';
	import { mediaPath } from '$lib/utils/format';

	let { url, token, alt, class: className = '' }: { url?: string; token?: string; alt: string; class?: string } = $props();

	// The shop's own /media proxy first (same origin, always reachable), then the
	// URL the API built; a placeholder when neither loads.
	const sources = $derived([mediaPath(token), url].filter((source, index, all): source is string => !!source && all.indexOf(source) === index));

	let attempt = $state(0);
	$effect(() => {
		void sources;
		attempt = 0;
	});
	const src = $derived(sources[attempt]);
</script>

<div class="relative overflow-hidden bg-muted {className}">
	{#if src}
		<img {src} {alt} loading="lazy" class="size-full object-cover" onerror={() => (attempt += 1)} />
	{:else}
		<div class="grid size-full place-items-center text-muted-foreground/50">
			<ImageOff class="size-1/4 max-h-10 max-w-10" />
		</div>
	{/if}
</div>
