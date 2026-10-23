import { ApiError } from '$lib/services/yespos/http.server';
import { getOrder } from '$lib/services/yespos/order.server';
import { respond } from '$lib/services/yespos/respond.server';
import type { RequestHandler } from './$types';

/** GET /api/orders/:uuid: one order with its payment details. */
export const GET: RequestHandler = ({ params }) =>
	respond(async () => {
		try {
			return await getOrder(params.uuid);
		} catch (err) {
			// The API answers an unknown order with 400 "record not found".
			if (err instanceof ApiError && (err.status === 400 || err.status === 404)) throw new ApiError(404, 'Pesanan tidak ditemukan.');
			throw err;
		}
	});
