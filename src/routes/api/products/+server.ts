import { getProducts } from '$lib/services/yespos/product.server';
import { respond } from '$lib/services/yespos/respond.server';
import type { RequestHandler } from './$types';

/** GET /api/products: the shop outlet's products grouped by category. */
export const GET: RequestHandler = () => respond(getProducts);
