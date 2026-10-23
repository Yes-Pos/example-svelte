import { ApiError } from '$lib/services/yespos/http.server';
import { changeOrderPayment } from '$lib/services/yespos/order.server';
import { respond } from '$lib/services/yespos/respond.server';
import type { RequestHandler } from './$types';

/**
 * POST /api/orders/:uuid/payment-method: switches a pending order to another
 * method. YesPOS reuses the buyer saved with the order.
 */
export const POST: RequestHandler = ({ params, request }) =>
	respond(async () => {
		const body = (await request.json().catch(() => null)) as { payment?: string } | null;
		if (!body?.payment) throw new ApiError(400, 'Pilih metode pembayaran.');
		return changeOrderPayment(params.uuid, body.payment);
	});
