<script lang="ts">
	import { CircleCheck, CircleX, Clock, RefreshCw } from '@lucide/svelte';
	import Countdown from '$lib/components/common/Countdown.svelte';
	import type { OrderState } from '$lib/types';

	let {
		state,
		expiredAt,
		refreshing,
		onrefresh
	}: { state: OrderState; expiredAt?: string; refreshing: boolean; onrefresh: () => void } = $props();

	const banners = {
		pending: { icon: Clock, title: 'Menunggu pembayaran', text: 'Selesaikan pembayaran sebelum batas waktu.', tone: 'bg-warning/15 text-warning' },
		paid: { icon: CircleCheck, title: 'Pembayaran berhasil', text: 'Terima kasih! Pesananmu sedang diproses.', tone: 'bg-success/15 text-success' },
		failed: { icon: CircleX, title: 'Pembayaran tidak berhasil', text: 'Pembayaran gagal atau kedaluwarsa.', tone: 'bg-destructive/15 text-destructive' }
	};
	const banner = $derived(banners[state]);
</script>

<section class="card flex items-start gap-4 p-5">
	<div class="grid size-12 flex-shrink-0 place-items-center rounded-full {banner.tone}">
		<banner.icon class="size-6" />
	</div>
	<div class="min-w-0 flex-1">
		<h1 class="text-lg font-semibold tracking-tight">{banner.title}</h1>
		<p class="text-sm text-muted-foreground">{banner.text}</p>
		{#if state === 'pending' && expiredAt}
			<p class="mt-2 text-xs text-muted-foreground">Sisa waktu <Countdown until={expiredAt} /></p>
		{/if}
	</div>
	<!-- The status is checked only on request, not polled. -->
	<button type="button" class="btn btn-ghost flex-shrink-0 px-3.5 py-2" onclick={onrefresh} disabled={refreshing}>
		<RefreshCw class="size-4 {refreshing ? 'animate-spin' : ''}" />
		<span>{refreshing ? 'Mengecek...' : 'Cek status'}</span>
	</button>
</section>
