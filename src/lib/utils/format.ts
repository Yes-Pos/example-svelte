import type { OrderState } from '$lib/types';

const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

export const formatRupiah = (value: number) => rupiah.format(value);

export const formatDate = (value?: string) =>
	value
		? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
		: '-';

/** The shop's own image URL for a media token (see routes/media), or '' when there is none. */
export const mediaPath = (token?: string) => (token ? `/media/${encodeURIComponent(token)}` : '');

/** Order statuses are "pending" or "<status>_<settlement>", e.g. "berhasil_settled". */
export const orderState = (status: string): OrderState => {
	const value = status.toLowerCase();
	if (value === 'pending' || value.startsWith('pending')) return 'pending';
	if (value.startsWith('berhasil') || value.startsWith('success')) return 'paid';
	return 'failed';
};

export const paymentLabel = (method: string, channel?: string) => {
	if (method === 'qris') return 'QRIS';
	if (method === 'edc') return 'Kartu (EDC)';
	if (method === 'va') return `Virtual Account ${channel ? channel.toUpperCase() : ''}`.trim();
	return method;
};

/** Form value of a payment method: "<method>:<channel>", e.g. "va:bca". */
export const paymentValue = (method: { payment_method: string; payment_channel: string }) =>
	`${method.payment_method}:${method.payment_channel}`;
