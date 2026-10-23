import { ApiError } from '$lib/services/yespos/http.server';
import { placeOrder } from '$lib/services/yespos/order.server';
import { respond } from '$lib/services/yespos/respond.server';
import type { CheckoutRequest } from '$lib/types';
import type { RequestHandler } from './$types';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** POST /api/orders: places an order; prices are looked up on the server. */
export const POST: RequestHandler = ({ request }) =>
	respond(
		async () => {
			const body = (await request.json().catch(() => null)) as CheckoutRequest | null;
			const lines = Array.isArray(body?.lines)
				? body.lines.filter((line) => typeof line?.productUuid === 'string' && Number.isFinite(line?.quantity))
				: [];
			const name = body?.name?.trim() ?? '';
			const email = body?.email?.trim() ?? '';
			const phone = body?.phone?.trim() ?? '';

			if (!lines.length) throw new ApiError(400, 'Keranjang masih kosong.');
			if (!name || !phone) throw new ApiError(400, 'Nama dan nomor HP wajib diisi.');
			if (!EMAIL.test(email)) throw new ApiError(400, 'Email tidak valid.');
			if (!body?.payment) throw new ApiError(400, 'Pilih metode pembayaran.');

			return placeOrder(lines, { name, email, phone }, body.payment);
		},
		{ status: 201 }
	);
