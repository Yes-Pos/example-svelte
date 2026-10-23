import type { PaymentMethod } from '$lib/types';
import { api } from './api';

export const getPaymentMethods = async () => (await api.get<PaymentMethod[]>('/payment-methods')).data;
