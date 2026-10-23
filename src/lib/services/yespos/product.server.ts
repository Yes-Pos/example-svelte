import type { ProductCategory, ProductDetail } from '$lib/types';
import { shop } from './http.server';

/** Products of the shop outlet, grouped by category. */
export const getProducts = (): Promise<ProductCategory[]> => shop().products();

export const getProduct = (productUuid: string): Promise<ProductDetail> => shop().product(productUuid);
