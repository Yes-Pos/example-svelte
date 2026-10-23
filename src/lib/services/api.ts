import axios, { AxiosError } from 'axios';

/**
 * Browser axios instance for the shop's own JSON endpoints (/api/*). Those
 * endpoints call YesPOS with the signed client credential on the server, so the
 * secret never reaches the browser while every request stays readable in the
 * network log.
 */
export const api = axios.create({
	baseURL: '/api',
	timeout: 20_000,
	headers: { Accept: 'application/json' }
});

/** Turns an axios error into an Error carrying the endpoint's message. */
api.interceptors.response.use(undefined, (error: AxiosError<{ message?: string }>) => {
	const message = error.response?.data?.message || (error.response ? `Permintaan gagal (${error.response.status}).` : 'Tidak dapat terhubung ke server toko.');
	return Promise.reject(Object.assign(new Error(message), { status: error.response?.status ?? 0 }));
});

/** The message of a failed request, for showing to the shopper. */
export const errorMessage = (err: unknown) => (err instanceof Error ? err.message : 'Terjadi kesalahan.');
