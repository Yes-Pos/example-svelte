<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import favicon from '$lib/assets/favicon.svg';
	import AppFooter from '$lib/components/layout/AppFooter.svelte';
	import AppHeader from '$lib/components/layout/AppHeader.svelte';
	import { shop } from '$lib/stores/shop.svelte';
	import MessageView from '$lib/views/MessageView.svelte';

	let { children } = $props();

	const storeName = env.PUBLIC_STORE_NAME || 'YesPOS Store';

	onMount(() => shop.load());
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{storeName}</title>
</svelte:head>

<div class="flex min-h-dvh flex-col">
	<AppHeader {storeName} />

	<main class="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
		{#if shop.error}
			<MessageView tone="warning" title="Toko belum siap" message={shop.error}>
				<div class="flex flex-col items-center gap-3">
					<button type="button" class="btn btn-primary" onclick={() => shop.load()}>Coba lagi</button>
					<p class="text-xs text-muted-foreground">Lihat README.md untuk cara mengisi file <code class="font-mono">.env</code>.</p>
				</div>
			</MessageView>
		{:else}
			{@render children()}
		{/if}
	</main>

	<AppFooter {storeName} />
</div>
