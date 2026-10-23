<script lang="ts">
	import { formatDate, paymentLabel } from '$lib/utils/format';
	import type { Order } from '$lib/types';

	let { order }: { order: Order } = $props();

	const rows = $derived(
		[
			{ label: 'No. pesanan', value: order.uuid.slice(0, 8).toUpperCase(), mono: true },
			{ label: 'Tanggal', value: formatDate(order.created_at) },
			{ label: 'Pembayaran', value: paymentLabel(order.payment_method, order.payment_channel) },
			{ label: 'Status', value: order.status, mono: true },
			{ label: 'Bayar sebelum', value: order.expired_at ? formatDate(order.expired_at) : '' },
			{ label: 'Ref. iPaymu', value: order.reference_ipaymu ?? '', mono: true }
		].filter((row) => row.value)
	);
</script>

<aside class="card h-fit p-5 lg:sticky lg:top-24">
	<h2 class="text-sm font-semibold">Info pesanan</h2>
	<dl class="mt-3 flex flex-col gap-2.5 text-sm">
		{#each rows as row (row.label)}
			<div class="flex justify-between gap-3">
				<dt class="text-muted-foreground">{row.label}</dt>
				<dd class={row.mono ? 'font-mono text-xs' : ''}>{row.value}</dd>
			</div>
		{/each}
	</dl>

	<h2 class="mt-5 border-t border-border pt-4 text-sm font-semibold">Pembeli</h2>
	{#if order.customer?.name}
		<dl class="mt-3 flex flex-col gap-2.5 text-sm">
			<div class="flex justify-between gap-3">
				<dt class="text-muted-foreground">Nama</dt>
				<dd class="truncate">{order.customer.name}</dd>
			</div>
			<div class="flex justify-between gap-3">
				<dt class="text-muted-foreground">Email</dt>
				<dd class="truncate">{order.customer.email}</dd>
			</div>
			<div class="flex justify-between gap-3">
				<dt class="text-muted-foreground">No. HP</dt>
				<dd class="font-mono text-xs">{order.customer.phone}</dd>
			</div>
		</dl>
	{:else}
		<p class="mt-2 text-xs text-muted-foreground">Data pembeli belum tersimpan untuk pesanan ini.</p>
	{/if}

	<a href="/" class="btn btn-ghost mt-5 w-full">Belanja lagi</a>
</aside>
