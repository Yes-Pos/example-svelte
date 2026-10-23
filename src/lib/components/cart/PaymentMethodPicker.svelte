<script lang="ts">
	import { Building2, CreditCard, QrCode } from '@lucide/svelte';
	import { paymentValue } from '$lib/utils/format';
	import type { PaymentMethod, PaymentMethodCode } from '$lib/types';

	let { methods, error = '', value = $bindable('') }: { methods: PaymentMethod[]; error?: string; value?: string } = $props();

	const groups = $derived.by(() => {
		const by = (code: PaymentMethodCode) => methods.filter((method) => method.payment_method === code);
		return [
			{ key: 'qris', title: 'QRIS', hint: 'Scan dengan e-wallet atau m-banking', icon: QrCode, methods: by('qris') },
			{ key: 'va', title: 'Virtual Account', hint: 'Transfer ke nomor VA bank', icon: Building2, methods: by('va') },
			{ key: 'edc', title: 'Kartu (EDC)', hint: 'Bayar dengan kartu debit/kredit', icon: CreditCard, methods: by('edc') }
		].filter((group) => group.methods.length);
	});
</script>

<section class="card p-4">
	<h2 class="text-sm font-semibold">Metode pembayaran</h2>
	{#if error}
		<p class="mt-3 rounded-2xl bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
	{:else if groups.length === 0}
		<p class="mt-3 rounded-2xl bg-warning/10 px-3 py-2 text-xs text-warning">
			Belum ada metode pembayaran aktif. Pemilik toko perlu mengaktifkannya di dashboard YesPOS.
		</p>
	{/if}
	<div class="mt-3 flex flex-col gap-3">
		{#each groups as group (group.key)}
			<fieldset>
				<legend class="flex items-center gap-1.5 px-1 text-xs text-muted-foreground">
					<group.icon class="size-3.5" />
					{group.title} · {group.hint}
				</legend>
				<div class="mt-1.5 grid gap-1.5 {group.key === 'va' ? 'grid-cols-3' : 'grid-cols-1'}">
					{#each group.methods as method (paymentValue(method))}
						<label
							class="flex cursor-pointer items-center justify-center rounded-2xl border px-3 py-2.5 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring
								{value === paymentValue(method) ? 'border-foreground bg-background' : 'border-border hover:border-border-strong'}"
						>
							<input type="radio" name="payment" value={paymentValue(method)} bind:group={value} class="sr-only" />
							{method.name}
						</label>
					{/each}
				</div>
			</fieldset>
		{/each}
	</div>
</section>
