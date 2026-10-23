<script lang="ts">
	import { formatRupiah } from '$lib/utils/format';
	import type { OrderItem } from '$lib/types';

	let { items, total }: { items: OrderItem[]; total: number } = $props();
</script>

<section class="card p-5">
	<h2 class="text-sm font-semibold">Rincian pesanan</h2>
	<ul class="mt-3 divide-y divide-border">
		{#each items as item, index (index)}
			<li class="flex items-start justify-between gap-3 py-2.5">
				<div class="min-w-0">
					<p class="truncate text-sm font-medium">{item.product_name}</p>
					<p class="font-mono text-xs text-muted-foreground tabular-nums">{item.quantity} × {formatRupiah(item.price)}</p>
				</div>
				<p class="font-mono text-sm tabular-nums">{formatRupiah(item.total)}</p>
			</li>
		{:else}
			<li class="py-2.5 text-sm text-muted-foreground">Tidak ada rincian item.</li>
		{/each}
	</ul>
	<div class="mt-2 flex items-baseline justify-between border-t border-border pt-3">
		<span class="text-sm font-medium">Total</span>
		<span class="font-mono text-lg font-semibold tabular-nums">{formatRupiah(total)}</span>
	</div>
</section>
