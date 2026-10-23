import { getPaymentMethods } from '$lib/services/yespos/payment.server';
import { respond } from '$lib/services/yespos/respond.server';
import type { RequestHandler } from './$types';

/** GET /api/payment-methods: methods the client owner activated. */
export const GET: RequestHandler = () => respond(getPaymentMethods);
