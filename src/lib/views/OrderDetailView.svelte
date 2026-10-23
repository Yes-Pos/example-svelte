<script lang="ts">
	import { ArrowLeft, LoaderCircle } from '@lucide/svelte';
	import ChangePaymentPanel from '$lib/components/order/ChangePaymentPanel.svelte';
	import EdcPayment from '$lib/components/order/EdcPayment.svelte';
	import OrderInfo from '$lib/components/order/OrderInfo.svelte';
	import OrderItems from '$lib/components/order/OrderItems.svelte';
	import OrderStatusBanner from '$lib/components/order/OrderStatusBanner.svelte';
	import QrisPayment from '$lib/components/order/QrisPayment.svelte';
	import VaPayment from '$lib/components/order/VaPayment.svelte';
	import MessageView from '$lib/views/MessageView.svelte';
	import { errorMessage } from '$lib/services/api';
	import { getOrder } from '$lib/services/order.service';
	import { recentOrders } from '$lib/stores/orders.svelte';
	import { orderState } from '$lib/utils/format';
	import type { Order } from '$lib/types';

	let { uuid }: { uuid: string } = $props();

	let order = $state<Order | null>(null);
	let error = $state('');
	let refreshing = $state(false);

	const paymentState = $derived(order ? orderState(order.status) : 'pending');

	const refresh = async () => {
		refreshing = true;
		try {
			order = await getOrder(uuid);
			error = '';
		} catch (err) {
			// Keep showing the last known order if a poll fails.
			if (!order) error = errorMessage(err);
		} finally {
			refreshing = false;
		}
	};

	$effect(() => {
		void uuid;
		order = null;
		refresh();
	});

	const onPaymentChanged = (changed: Order) => {
		order = changed;
		recentOrders.setMethod(changed.uuid, changed.payment_method);
	};

</script>

<a href="/orders" class="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
	<ArrowLeft class="size-4" /> Pesanan saya
</a>

{#if error}
	<div class="mt-5">
		<MessageView title="Pesanan tidak dapat dimuat" message={error}>
			<a href="/orders" class="btn btn-primary">Lihat pesanan saya</a>
		</MessageView>
	</div>
{:else if !order}
	<div class="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
		<div class="flex flex-col gap-6">
			<div class="h-24 animate-pulse rounded-3xl bg-muted"></div>
			<div class="h-80 animate-pulse rounded-3xl bg-muted"></div>
		</div>
		<div class="h-64 animate-pulse rounded-3xl bg-muted"></div>
	</div>
{:else}
	<div class="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
		<div class="flex flex-col gap-6">
			<OrderStatusBanner state={paymentState} expiredAt={order.expired_at} {refreshing} onrefresh={refresh} />

			{#if paymentState === 'pending'}
				<section class="card p-5 sm:p-6">
					{#if order.payment_method === 'qris' && order.qr_string}
						<QrisPayment qrString={order.qr_string} total={order.total_payment} orderUuid={order.uuid} />
					{:else if order.payment_method === 'va' && order.payment_no}
						<VaPayment {order} />
					{:else if order.payment_method === 'edc' && order.app_link}
						<EdcPayment link={order.app_link} total={order.total_payment} />
					{:else}
						<p class="flex items-center gap-2 text-sm text-muted-foreground">
							<LoaderCircle class="size-4 animate-spin" /> Menyiapkan instruksi pembayaran...
						</p>
					{/if}

					<div class="mt-6 border-t border-border pt-5">
						<ChangePaymentPanel {order} onchanged={onPaymentChanged} />
					</div>
				</section>
			{/if}

			<OrderItems items={order.items} total={order.total_payment} />
		</div>

		<OrderInfo {order} />
	</div>
{/if}
