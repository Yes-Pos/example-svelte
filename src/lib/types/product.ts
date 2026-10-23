export interface ProductVariant {
	uuid: string;
	name: string;
	price: number;
	current_stock: number;
	main_image_token?: string;
	/** Public image URL from the API; preferred over building one from the token. */
	main_image_url?: string;
}

export interface ProductAddOn {
	uuid: string;
	add_on_name: string;
	price: number;
}

export interface Product {
	uuid: string;
	name: string;
	description?: string;
	price: number;
	unit: string;
	type: string;
	current_stock: number;
	main_image_token?: string;
	/** Public image URL from the API; preferred over building one from the token. */
	main_image_url?: string;
	track_stock: boolean;
	variants: ProductVariant[] | null;
	add_ons?: ProductAddOn[] | null;
}

export interface ProductDetail extends Product {
	categories: string[];
}

export interface ProductCategory {
	category_uuid: string;
	category_name: string;
	products: Product[];
}
