import type { CheckoutLine, Customer, Order } from '$lib/types';
import { shop } from './http.server';

export const getOrder = (uuid: string): Promise<Order> => shop().order(uuid);

/**
 * Places an order for the cart lines. The SDK prices every line from the API,
 * never from the browser, and refuses a method the client owner did not activate.
 */
export const placeOrder = (lines: CheckoutLine[], customer: Customer, payment: string): Promise<Order> =>
	shop().placeOrder(lines, customer, payment);

/**
 * Switches a pending order to another activated payment method; YesPOS creates
 * a new payment request for the same total and returns the new instructions.
 */
export const changeOrderPayment = (uuid: string, payment: string): Promise<Order> => shop().changePayment(uuid, payment);
