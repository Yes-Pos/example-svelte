export type PaymentMethodCode = 'qris' | 'va' | 'edc';

/** A payment method the client owner activated (GET /api/client/payment-method). */
export interface PaymentMethod {
	name: string;
	type: string;
	issuer: string;
	payment_method: PaymentMethodCode;
	payment_channel: string;
	required_fields: string[];
}
