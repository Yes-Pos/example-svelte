<script lang="ts">
	import { CreditCard, QrCode, Wallet } from '@lucide/svelte';

	let { outletName }: { outletName?: string } = $props();

	const payments = [
		{ icon: QrCode, label: 'QRIS' },
		{ icon: Wallet, label: 'Virtual Account' },
		{ icon: CreditCard, label: 'Kartu (EDC)' }
	];
</script>

<section class="card relative overflow-hidden p-6 sm:p-10" style="background: var(--gradient-bg)">
	<div class="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full opacity-25 blur-3xl" style="background: var(--gradient-accent)"></div>
	<div class="relative max-w-2xl">
		<span class="chip border border-border bg-background/60 text-muted-foreground">
			<span class="size-1.5 rounded-full bg-success"></span>
			Buka{outletName ? ` · ${outletName}` : ''}
		</span>
		<h1 class="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
			Belanja cepat,<br />
			<span class="bg-clip-text text-transparent" style="background-image: var(--gradient-accent)">bayar sekejap.</span>
		</h1>
		<p class="mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
			Pilih produk, masukkan ke keranjang, lalu bayar dengan metode favoritmu.
		</p>
		<div class="mt-6 flex flex-wrap gap-2">
			{#each payments as payment (payment.label)}
				<span class="chip border border-border bg-background/60">
					<payment.icon class="size-3.5 text-muted-foreground" />
					{payment.label}
				</span>
			{/each}
		</div>
	</div>
</section>
