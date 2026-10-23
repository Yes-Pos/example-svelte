import type { Product, ProductCategory } from '$lib/types';

/** A product tracking stock is sold out when it, or every variant, has none left. */
export const isSoldOut = (product: Product) => {
	if (!product.track_stock) return false;
	const variants = product.variants ?? [];
	return variants.length ? variants.every((variant) => variant.current_stock <= 0) : product.current_stock <= 0;
};

/** Lowest and highest price, over the variants when the product has any. */
export const priceRange = (product: Product) => {
	const prices = (product.variants ?? []).map((variant) => variant.price);
	if (!prices.length) return { min: product.price, max: product.price };
	return { min: Math.min(...prices), max: Math.max(...prices) };
};

/** Uncategorized products have no category uuid, so the name keeps keys unique. */
export const categoryKey = (category: ProductCategory) => category.category_uuid + category.category_name;
