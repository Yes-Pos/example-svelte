<script lang="ts">
	import { onMount } from 'svelte';
	import { ChevronRight, Receipt } from '@lucide/svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';
	import { recentOrders } from '$lib/stores/orders.svelte';
	import { formatDate, formatRupiah, paymentLabel } from '$lib/utils/format';

	let mounted = $state(false);
	onMount(() => (mounted = true));
</script>

<h1 class="text-3xl font-semibold tracking-tight">Pesanan saya</h1>
<p class="mt-1 text-sm text-muted-foreground">Pesanan yang dibuat dari perangkat ini.</p>

<div class="mt-6">
	{#if !mounted}
		<div class="h-40 animate-pulse rounded-3xl bg-muted"></div>
	{:else if recentOrders.list.length === 0}
		<EmptyState icon={Receipt} title="Belum ada pesanan">
			<a href="/" class="btn btn-primary">Mulai belanja</a>
		</EmptyState>
	{:else}
		<ul class="card divide-y divide-border p-2">
			{#each recentOrders.list as order (order.uuid)}
				<li>
					<a href="/orders/{order.uuid}" class="group flex items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-background">
						<span class="grid size-10 place-items-center rounded-2xl bg-background text-muted-foreground">
							<Receipt class="size-4" />
						</span>
						<span class="min-w-0 flex-1">
							<span class="block font-mono text-sm font-medium">#{order.uuid.slice(0, 8).toUpperCase()}</span>
							<span class="block text-xs text-muted-foreground">{formatDate(order.createdAt)} · {paymentLabel(order.method)}</span>
						</span>
						<span class="font-mono text-sm font-semibold tabular-nums">{formatRupiah(order.total)}</span>
						<ChevronRight class="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</div>
