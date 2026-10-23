import type { PaymentMethod } from '$lib/types';
import { shop } from './http.server';

/** Payment methods the client owner activated; EDC only when its terminal is configured. */
export const getPaymentMethods = (): Promise<PaymentMethod[]> => shop().paymentMethods();
