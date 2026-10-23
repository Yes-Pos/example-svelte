<script lang="ts">
	import { onMount } from 'svelte';
	import { PackageSearch, Search } from '@lucide/svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';
	import CatalogHero from '$lib/components/product/CatalogHero.svelte';
	import CategoryTabs from '$lib/components/product/CategoryTabs.svelte';
	import ProductCard from '$lib/components/product/ProductCard.svelte';
	import MessageView from '$lib/views/MessageView.svelte';
	import { errorMessage } from '$lib/services/api';
	import { getProducts } from '$lib/services/product.service';
	import { shop } from '$lib/stores/shop.svelte';
	import { categoryKey } from '$lib/utils/product';
	import type { Product, ProductCategory } from '$lib/types';

	let categories = $state<ProductCategory[]>([]);
	let loading = $state(true);
	let error = $state('');

	const load = async () => {
		loading = true;
		error = '';
		try {
			categories = await getProducts();
		} catch (err) {
			error = errorMessage(err);
		} finally {
			loading = false;
		}
	};

	onMount(load);

	let query = $state('');
	let activeCategory = $state('');

	// A product can sit in several categories; "Semua" lists it once.
	const allProducts = $derived.by(() => {
		const seen = new Map<string, Product>();
		for (const category of categories) {
			for (const product of category.products) seen.set(product.uuid, product);
		}
		return [...seen.values()];
	});

	const visibleProducts = $derived.by(() => {
		const source = activeCategory
			? (categories.find((category) => categoryKey(category) === activeCategory)?.products ?? [])
			: allProducts;
		const term = query.trim().toLowerCase();
		return term ? source.filter((product) => product.name.toLowerCase().includes(term)) : source;
	});
</script>

<CatalogHero outletName={shop.info?.outlet.name} />

<section class="mt-10" aria-labelledby="catalog-title">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<h2 id="catalog-title" class="text-xl font-semibold tracking-tight">Produk</h2>
			<p class="text-xs text-muted-foreground">{allProducts.length} produk tersedia</p>
		</div>
		<label class="relative sm:w-72">
			<span class="sr-only">Cari produk</span>
			<Search class="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
			<input bind:value={query} type="search" placeholder="Cari produk..." class="field rounded-full pl-10" />
		</label>
	</div>

	{#if categories.length > 1}
		<div class="mt-5"><CategoryTabs {categories} bind:active={activeCategory} /></div>
	{/if}

	<div class="mt-6">
		{#if loading}
			<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
				{#each Array(8) as _, index (index)}
					<div class="aspect-[3/4] animate-pulse rounded-3xl bg-muted"></div>
				{/each}
			</div>
		{:else if error}
			<MessageView title="Gagal memuat produk" message={error}>
				<button type="button" class="btn btn-primary" onclick={load}>Coba lagi</button>
			</MessageView>
		{:else if visibleProducts.length}
			<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
				{#each visibleProducts as product (product.uuid)}
					<ProductCard {product} />
				{/each}
			</div>
		{:else}
			<EmptyState icon={PackageSearch} title="Produk tidak ditemukan" description="Coba kata kunci atau kategori lain." />
		{/if}
	</div>
</section>
