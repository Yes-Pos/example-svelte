import type { Customer } from './cart';
import type { PaymentMethodCode } from './payment';

export interface OrderItem {
	product_name: string;
	quantity: number;
	price: number;
	total: number;
}

export interface Order {
	uuid: string;
	total_payment: number;
	payment_method: PaymentMethodCode;
	payment_channel?: string;
	status: string;
	/** QRIS: render as a QR code. */
	qr_string?: string;
	/** EDC: link to open on the terminal. */
	app_link?: string;
	/** Virtual account number, holder name and deadline. */
	payment_no?: string;
	payment_name?: string;
	expired_at?: string;
	items: OrderItem[];
	/** The buyer; missing for orders created before YesPOS saved buyers. */
	customer?: Customer;
	reference_ipaymu?: string;
	created_at: string;
}

export interface CreateOrderPayload {
	total_payment: number;
	payment_method: string;
	payment_channel?: string;
	name: string;
	email: string;
	phone: string;
	notify_url?: string;
	items: OrderItem[];
	app_code?: string;
	terminal_code?: string;
	merchant_code?: string;
}

/** An order placed from this browser, kept for "Pesanan saya". */
export interface RecentOrder {
	uuid: string;
	total: number;
	method: string;
	createdAt: string;
}

export type OrderState = 'pending' | 'paid' | 'failed';
