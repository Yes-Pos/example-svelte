import { json } from '@sveltejs/kit';
import { ApiError } from './http.server';

/**
 * Runs a BFF handler and answers plain JSON, so the browser's network log shows
 * readable data; errors become { "message": "..." } with the API's status.
 */
export async function respond(handler: () => Promise<unknown>, init?: ResponseInit): Promise<Response> {
	try {
		return json(await handler(), init);
	} catch (err) {
		// A network failure carries status 0, which is not a valid HTTP status.
		if (err instanceof ApiError) return json({ message: err.message }, { status: err.status || 502 });
		console.error(err);
		return json({ message: 'Terjadi kesalahan pada server toko.' }, { status: 500 });
	}
}
