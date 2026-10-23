<script lang="ts">
	import { onMount } from 'svelte';
	import { Moon, Receipt, ShoppingBag, Store, Sun } from '@lucide/svelte';
	import { cart } from '$lib/stores/cart.svelte';
	import { shop } from '$lib/stores/shop.svelte';
	import { theme } from '$lib/stores/theme.svelte';

	let { storeName }: { storeName: string } = $props();
	const outletName = $derived(shop.info?.outlet.name);

	// The cart lives in localStorage, so its count is shown only after mount to
	// keep the server and client markup identical.
	let mounted = $state(false);
	onMount(() => {
		mounted = true;
		theme.sync();
	});
</script>

<header class="glass sticky top-0 z-40 border-b border-border">
	<div class="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
		<a href="/" class="flex min-w-0 items-center gap-2.5">
			<span class="grid size-9 place-items-center rounded-2xl bg-primary text-primary-foreground">
				<Store class="size-4" />
			</span>
			<span class="min-w-0">
				<span class="block truncate text-sm font-semibold tracking-tight">{storeName}</span>
				{#if outletName}<span class="block truncate text-xs text-muted-foreground">{outletName}</span>{/if}
			</span>
		</a>

		<nav class="ml-auto flex items-center gap-1">
			<a href="/orders" class="btn-icon" aria-label="Pesanan saya" title="Pesanan saya">
				<Receipt class="size-4" />
			</a>
			<button type="button" class="btn-icon" onclick={() => theme.toggle()} aria-label="Ganti tema" title="Ganti tema">
				{#if theme.dark}<Sun class="size-4" />{:else}<Moon class="size-4" />{/if}
			</button>
			<a href="/cart" class="btn btn-primary ml-1 py-2 pr-3 pl-3.5" aria-label="Keranjang">
				<ShoppingBag class="size-4" />
				<span class="hidden sm:inline">Keranjang</span>
				<span class="grid min-w-5 place-items-center rounded-full bg-primary-foreground/15 px-1.5 font-mono text-xs tabular-nums">
					{mounted ? cart.count : 0}
				</span>
			</a>
		</nav>
	</div>
</header>
