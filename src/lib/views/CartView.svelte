<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { ShoppingBag } from '@lucide/svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';
	import CartLineItem from '$lib/components/cart/CartLineItem.svelte';
	import CartSummary from '$lib/components/cart/CartSummary.svelte';
	import CustomerForm from '$lib/components/cart/CustomerForm.svelte';
	import PaymentMethodPicker from '$lib/components/cart/PaymentMethodPicker.svelte';
	import { errorMessage } from '$lib/services/api';
	import { createOrder } from '$lib/services/order.service';
	import { getPaymentMethods } from '$lib/services/payment.service';
	import { cart } from '$lib/stores/cart.svelte';
	import { recentOrders } from '$lib/stores/orders.svelte';
	import { paymentValue } from '$lib/utils/format';
	import type { Customer, PaymentMethod } from '$lib/types';

	let mounted = $state(false);
	let paymentMethods = $state<PaymentMethod[]>([]);
	let methodsError = $state('');
	let payment = $state('');
	let customer = $state<Customer>({ name: '', email: '', phone: '' });
	let submitting = $state(false);
	let error = $state('');

	onMount(async () => {
		mounted = true;
		try {
			paymentMethods = await getPaymentMethods();
			payment = paymentMethods[0] ? paymentValue(paymentMethods[0]) : '';
		} catch (err) {
			methodsError = errorMessage(err);
		}
	});

	const submit = async (event: SubmitEvent) => {
		event.preventDefault();
		submitting = true;
		error = '';
		try {
			// Only uuids and quantities are sent; the server looks up the prices.
			const order = await createOrder({ ...customer, payment, lines: cart.checkoutLines() });
			recentOrders.add({ uuid: order.uuid, total: order.total_payment, method: order.payment_method, createdAt: order.created_at });
			cart.clear();
			await goto(`/orders/${order.uuid}`);
		} catch (err) {
			error = errorMessage(err);
			// The message sits next to the pay button, which may be off screen.
			await tick();
			document.querySelector('[data-checkout-error]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
		} finally {
			submitting = false;
		}
	};
</script>

<h1 class="text-3xl font-semibold tracking-tight">Keranjang</h1>

<div class="mt-6">
	{#if !mounted}
		<div class="h-64 animate-pulse rounded-3xl bg-muted"></div>
	{:else if cart.lines.length === 0}
		<EmptyState icon={ShoppingBag} title="Keranjang masih kosong" description="Yuk pilih produk favoritmu.">
			<a href="/" class="btn btn-primary">Lihat produk</a>
		</EmptyState>
	{:else}
		<form class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]" onsubmit={submit}>
			<section class="card divide-y divide-border p-2" aria-label="Isi keranjang">
				{#each cart.lines as line (line.productUuid + (line.variantUuid ?? ''))}
					<CartLineItem {line} />
				{/each}
			</section>

			<aside class="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
				<CustomerForm bind:customer />
				<PaymentMethodPicker methods={paymentMethods} error={methodsError} bind:value={payment} />
				<CartSummary count={cart.count} total={cart.total} {error} {submitting} disabled={!payment} />
			</aside>
		</form>
	{/if}
</div>
