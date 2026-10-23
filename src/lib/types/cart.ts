/** A line in the shopping cart; prices are re-checked on the server at checkout. */
export interface CartLine {
	productUuid: string;
	variantUuid?: string;
	name: string;
	variantName?: string;
	price: number;
	quantity: number;
	imageToken?: string;
	imageUrl?: string;
}

/** What the browser sends at checkout: no prices, the server looks them up. */
export interface CheckoutLine {
	productUuid: string;
	variantUuid?: string;
	quantity: number;
}

export interface Customer {
	name: string;
	email: string;
	phone: string;
}

/** Body of POST /api/orders. */
export interface CheckoutRequest extends Customer {
	/** "<method>:<channel>", e.g. "va:bca". */
	payment: string;
	lines: CheckoutLine[];
}
