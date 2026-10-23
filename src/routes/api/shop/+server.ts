import { env } from '$env/dynamic/public';
import { getShopOutlet } from '$lib/services/yespos/outlet.server';
import { respond } from '$lib/services/yespos/respond.server';
import type { RequestHandler } from './$types';

/** GET /api/shop: the shop name and the outlet it sells from. */
export const GET: RequestHandler = () =>
	respond(async () => ({ store_name: env.PUBLIC_STORE_NAME || 'YesPOS Store', outlet: await getShopOutlet() }));
