import type { Outlet } from '$lib/types';
import { shop } from './http.server';

export const getOutlets = (): Promise<Outlet[]> => shop().client.outlets.list();

/** The outlet the shop sells from: YESPOS_OUTLET_UUID, or the client's first outlet. */
export const getShopOutlet = (): Promise<Outlet> => shop().outlet();
