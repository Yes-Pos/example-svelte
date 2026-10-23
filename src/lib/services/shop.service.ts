import type { Outlet } from '$lib/types';
import { api } from './api';

export interface ShopInfo {
	store_name: string;
	outlet: Outlet;
}

export const getShop = async () => (await api.get<ShopInfo>('/shop')).data;
