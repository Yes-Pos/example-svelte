import type { CheckoutRequest, Order } from '$lib/types';
import { api } from './api';

export const createOrder = async (body: CheckoutRequest) => (await api.post<Order>('/orders', body)).data;

export const getOrder = async (uuid: string) => (await api.get<Order>(`/orders/${encodeURIComponent(uuid)}`)).data;

/** Switches a pending order to another payment method ("<method>:<channel>"). */
export const changeOrderPayment = async (uuid: string, payment: string) =>
	(await api.post<Order>(`/orders/${encodeURIComponent(uuid)}/payment-method`, { payment })).data;
