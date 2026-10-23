import { getProduct } from '$lib/services/yespos/product.server';
import { respond } from '$lib/services/yespos/respond.server';
import type { RequestHandler } from './$types';

/** GET /api/products/:uuid: one product of the shop outlet. */
export const GET: RequestHandler = ({ params }) => respond(() => getProduct(params.uuid));
