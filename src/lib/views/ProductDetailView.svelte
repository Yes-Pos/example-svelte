<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowLeft, Check, ShoppingBag, Zap } from '@lucide/svelte';
	import ProductImage from '$lib/components/common/ProductImage.svelte';
	import QuantityStepper from '$lib/components/common/QuantityStepper.svelte';
	import VariantPicker from '$lib/components/product/VariantPicker.svelte';
	import MessageView from '$lib/views/MessageView.svelte';
	import { errorMessage } from '$lib/services/api';
	import { getProduct } from '$lib/services/product.service';
	import { cart } from '$lib/stores/cart.svelte';
	import { formatRupiah } from '$lib/utils/format';
	import { isSoldOut } from '$lib/utils/product';
	import type { ProductDetail } from '$lib/types';

	let { uuid }: { uuid: string } = $props();

	let loaded = $state<ProductDetail | null>(null);
	let loading = $state(true);
	let error = $state('');

	const load = async (productUuid: string) => {
		loading = true;
		error = '';
		try {
			loaded = await getProduct(productUuid);
		} catch (err) {
			error = errorMessage(err);
		} finally {
			loading = false;
		}
	};

	$effect(() => {
		load(uuid);
	});

	// Renders only once loaded; the empty fallback keeps the derived values typed.
	const product = $derived(
		loaded ?? ({ uuid, name: '', price: 0, unit: '', type: '', current_stock: 0, track_stock: false, variants: [], categories: [] } as ProductDetail)
	);
	const variants = $derived(product.variants ?? []);
	const inStock = (stock: number) => !product.track_stock || stock > 0;

	let variantUuid = $state('');
	let quantity = $state(1);
	let added = $state(false);

	// Preselect the first variant that can be bought.
	$effect(() => {
		if (variants.length && !variants.some((variant) => variant.uuid === variantUuid)) {
			variantUuid = (variants.find((variant) => inStock(variant.current_stock)) ?? variants[0]).uuid;
		}
	});

	const variant = $derived(variants.find((item) => item.uuid === variantUuid));
	const price = $derived(variant ? variant.price : product.price);
	const stock = $derived(variant ? variant.current_stock : product.current_stock);
	const canBuy = $derived(!isSoldOut(product) && inStock(stock) && (!variants.length || !!variant));
	const maxQuantity = $derived(product.track_stock ? Math.max(1, Math.floor(stock)) : 999);
	// A variant with its own photo shows it; otherwise the product photo.
	const imageToken = $derived(variant?.main_image_token || product.main_image_token);
	const imageUrl = $derived(variant?.main_image_token ? variant.main_image_url : product.main_image_url);

	const addToCart = () => {
		cart.add({
			productUuid: product.uuid,
			variantUuid: variant?.uuid,
			name: product.name,
			variantName: variant?.name,
			price,
			quantity,
			imageToken,
			imageUrl
		});
		added = true;
		setTimeout(() => (added = false), 1500);
	};

	const buyNow = () => {
		addToCart();
		goto('/cart');
	};
</script>

<svelte:head>
	{#if loaded}<title>{loaded.name}</title>{/if}
</svelte:head>

<a href="/" class="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
	<ArrowLeft class="size-4" /> Kembali ke produk
</a>

{#if loading}
	<div class="mt-5 grid gap-6 lg:grid-cols-2 lg:gap-10">
		<div class="aspect-square animate-pulse rounded-3xl bg-muted"></div>
		<div class="flex flex-col gap-3">
			<div class="h-8 w-2/3 animate-pulse rounded-full bg-muted"></div>
			<div class="h-6 w-1/3 animate-pulse rounded-full bg-muted"></div>
			<div class="mt-4 h-32 animate-pulse rounded-3xl bg-muted"></div>
		</div>
	</div>
{:else if error}
	<div class="mt-5">
		<MessageView title="Produk tidak dapat dimuat" message={error}>
			<a href="/" class="btn btn-primary">Kembali ke toko</a>
		</MessageView>
	</div>
{:else}
<div class="mt-5 grid gap-6 lg:grid-cols-2 lg:gap-10">
	<div class="card p-2">
		<ProductImage url={imageUrl} token={imageToken} alt={product.name} class="aspect-square rounded-2xl" />
	</div>

	<div class="flex flex-col">
		{#if product.categories.length}
			<div class="flex flex-wrap gap-1.5">
				{#each product.categories as category (category)}
					<span class="chip border border-border text-muted-foreground">{category}</span>
				{/each}
			</div>
		{/if}
		<h1 class="mt-3 text-3xl font-semibold tracking-tight">{product.name}</h1>
		<p class="mt-2 font-mono text-2xl font-semibold tabular-nums">{formatRupiah(price)}</p>
		<p class="mt-1 text-xs text-muted-foreground">
			per {product.unit}
			{#if product.track_stock}· {inStock(stock) ? `stok ${stock}` : 'stok habis'}{/if}
		</p>

		{#if product.description}
			<p class="mt-5 text-sm leading-6 text-muted-foreground">{product.description}</p>
		{/if}

		{#if variants.length}
			<div class="mt-6"><VariantPicker {variants} trackStock={product.track_stock} bind:value={variantUuid} /></div>
		{/if}

		<div class="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-muted/60 p-3.5">
			<div>
				<p class="text-xs text-muted-foreground">Jumlah</p>
				<p class="font-mono text-sm font-semibold tabular-nums">{formatRupiah(price * quantity)}</p>
			</div>
			<QuantityStepper value={quantity} max={maxQuantity} onchange={(value) => (quantity = value)} />
		</div>

		<div class="mt-4 grid grid-cols-2 gap-2">
			<button type="button" class="btn btn-ghost py-3" disabled={!canBuy} onclick={addToCart}>
				{#if added}<Check class="size-4 text-success" /> Ditambahkan{:else}<ShoppingBag class="size-4" /> Keranjang{/if}
			</button>
			<button type="button" class="btn btn-primary py-3" disabled={!canBuy} onclick={buyNow}>
				<Zap class="size-4" /> Beli sekarang
			</button>
		</div>
		{#if !canBuy}
			<p class="mt-3 text-center text-xs text-muted-foreground">Produk ini sedang tidak tersedia.</p>
		{/if}
	</div>
</div>
{/if}
