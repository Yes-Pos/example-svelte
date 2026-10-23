<script lang="ts">
	import { Trash2 } from '@lucide/svelte';
	import ProductImage from '$lib/components/common/ProductImage.svelte';
	import QuantityStepper from '$lib/components/common/QuantityStepper.svelte';
	import { cart } from '$lib/stores/cart.svelte';
	import { formatRupiah } from '$lib/utils/format';
	import type { CartLine } from '$lib/types';

	let { line }: { line: CartLine } = $props();
</script>

<div class="flex gap-3 p-3">
	<ProductImage url={line.imageUrl} token={line.imageToken} alt={line.name} class="size-16 flex-shrink-0 rounded-2xl sm:size-20" />
	<div class="flex min-w-0 flex-1 flex-col">
		<div class="flex items-start justify-between gap-2">
			<div class="min-w-0">
				<a href="/products/{line.productUuid}" class="block truncate text-sm font-medium hover:underline">{line.name}</a>
				{#if line.variantName}<p class="text-xs text-muted-foreground">{line.variantName}</p>{/if}
			</div>
			<button type="button" class="btn-icon size-8 text-muted-foreground" aria-label="Hapus {line.name}" onclick={() => cart.remove(line)}>
				<Trash2 class="size-4" />
			</button>
		</div>
		<div class="mt-auto flex items-end justify-between gap-2 pt-2">
			<QuantityStepper value={line.quantity} onchange={(value) => cart.setQuantity(line, value)} />
			<p class="font-mono text-sm font-semibold tabular-nums">{formatRupiah(line.price * line.quantity)}</p>
		</div>
	</div>
</div>
