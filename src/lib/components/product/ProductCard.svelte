<script lang="ts">
	import { Plus } from '@lucide/svelte';
	import ProductImage from '$lib/components/common/ProductImage.svelte';
	import { cart } from '$lib/stores/cart.svelte';
	import { formatRupiah } from '$lib/utils/format';
	import { isSoldOut, priceRange } from '$lib/utils/product';
	import type { Product } from '$lib/types';

	let { product }: { product: Product } = $props();

	const variants = $derived(product.variants ?? []);
	const soldOut = $derived(isSoldOut(product));
	const range = $derived(priceRange(product));

	let added = $state(false);

	// Products with variants are added from the detail page, where a variant is picked.
	const quickAdd = (event: MouseEvent) => {
		event.preventDefault();
		cart.add({
			productUuid: product.uuid,
			name: product.name,
			price: product.price,
			quantity: 1,
			imageToken: product.main_image_token,
			imageUrl: product.main_image_url
		});
		added = true;
		setTimeout(() => (added = false), 1200);
	};
</script>

<a
	href="/products/{product.uuid}"
	class="group card flex flex-col overflow-hidden p-2 transition-[border-color,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-border-strong"
>
	<ProductImage
		url={product.main_image_url}
		token={product.main_image_token}
		alt={product.name}
		class="aspect-square rounded-2xl transition-transform duration-500 ease-out group-hover:scale-[1.02]"
	/>
	<div class="flex flex-1 flex-col gap-1 px-2 pt-3 pb-2">
		<h3 class="line-clamp-2 text-sm font-medium">{product.name}</h3>
		{#if variants.length}
			<p class="text-xs text-muted-foreground">{variants.length} varian</p>
		{/if}
		<div class="mt-auto flex items-end justify-between gap-2 pt-2">
			<p class="font-mono text-sm font-semibold tabular-nums">
				{range.min === range.max ? formatRupiah(range.min) : `${formatRupiah(range.min)}+`}
			</p>
			{#if soldOut}
				<span class="chip bg-muted text-muted-foreground">Habis</span>
			{:else if !variants.length}
				<button
					type="button"
					class="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground transition-transform outline-none hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring active:scale-95"
					aria-label="Tambah {product.name} ke keranjang"
					onclick={quickAdd}
				>
					<Plus class="size-4 transition-transform {added ? 'rotate-90' : ''}" />
				</button>
			{/if}
		</div>
	</div>
</a>
