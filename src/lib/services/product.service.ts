import type { ProductCategory, ProductDetail } from '$lib/types';
import { api } from './api';

export const getProducts = async () => (await api.get<ProductCategory[]>('/products')).data;

export const getProduct = async (uuid: string) => (await api.get<ProductDetail>(`/products/${encodeURIComponent(uuid)}`)).data;
