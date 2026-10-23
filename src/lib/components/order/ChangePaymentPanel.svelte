<script lang="ts">
	import { ArrowLeftRight, LoaderCircle, TriangleAlert } from '@lucide/svelte';
	import PaymentMethodPicker from '$lib/components/cart/PaymentMethodPicker.svelte';
	import { errorMessage } from '$lib/services/api';
	import { changeOrderPayment } from '$lib/services/order.service';
	import { getPaymentMethods } from '$lib/services/payment.service';
	import { paymentValue } from '$lib/utils/format';
	import type { Order, PaymentMethod } from '$lib/types';

	let { order, onchanged }: { order: Order; onchanged: (order: Order) => void } = $props();

	let open = $state(false);
	let methods = $state<PaymentMethod[]>([]);
	let loadError = $state('');
	let selected = $state('');
	let saving = $state(false);
	let error = $state('');

	const current = $derived(`${order.payment_method}:${order.payment_channel ?? ''}`);

	// Methods are loaded only when the buyer wants to switch.
	const show = async () => {
		open = true;
		error = '';
		selected = current;
		if (methods.length) return;
		try {
			methods = await getPaymentMethods();
		} catch (err) {
			loadError = errorMessage(err);
		}
	};

	const confirm = async () => {
		saving = true;
		error = '';
		try {
			// The buyer saved with the order is reused by YesPOS; nothing to fill in again.
			onchanged(await changeOrderPayment(order.uuid, selected));
			open = false;
		} catch (err) {
			error = errorMessage(err);
		} finally {
			saving = false;
		}
	};

	// Picking the current method again renews its payment (e.g. an expired VA).
	const label = $derived(selected === current ? 'Buat ulang tagihan' : 'Gunakan metode ini');
</script>

{#if !open}
	<button type="button" class="btn btn-ghost w-full" onclick={show}>
		<ArrowLeftRight class="size-4" /> Ganti metode pembayaran
	</button>
{:else}
	<div class="flex flex-col gap-3">
		{#if methods.length || loadError}
			<PaymentMethodPicker methods={methods} error={loadError} bind:value={selected} />
		{:else}
			<div class="flex h-32 items-center justify-center rounded-3xl bg-muted text-sm text-muted-foreground">
				<LoaderCircle class="mr-2 size-4 animate-spin" /> Memuat metode pembayaran...
			</div>
		{/if}

		<p class="px-1 text-xs text-muted-foreground">
			Tagihan lama tetap berlaku sampai kedaluwarsa; bayar dengan salah satunya saja.
		</p>

		{#if error}
			<p class="flex gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive" role="alert">
				<TriangleAlert class="size-3.5 flex-shrink-0" />
				{error}
			</p>
		{/if}

		<div class="grid grid-cols-2 gap-2">
			<button type="button" class="btn btn-ghost" onclick={() => (open = false)} disabled={saving}>Batal</button>
			<button type="button" class="btn btn-primary" onclick={confirm} disabled={saving || !selected || !methods.length}>
				{#if saving}<LoaderCircle class="size-4 animate-spin" /> Memproses...{:else}{label}{/if}
			</button>
		</div>
	</div>
{/if}
