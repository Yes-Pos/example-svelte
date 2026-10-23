import { error } from '@sveltejs/kit';
import { mediaBaseUrl } from '$lib/services/yespos/http.server';
import type { RequestHandler } from './$types';

/**
 * GET /media/:token: product images served from the shop's own origin. They are
 * fetched from YESPOS_API_BASE_URL, so they load even when the URLs the API
 * builds (from the backend HOST setting) are not reachable from the browser.
 */
export const GET: RequestHandler = async ({ params, fetch }) => {
	if (!/^[\w.-]+$/.test(params.token)) error(400, 'Token gambar tidak valid.');
	const upstream = await fetch(`${mediaBaseUrl()}/${params.token}`).catch(() => null);
	const contentType = upstream?.headers.get('content-type') ?? '';
	if (!upstream?.ok || !contentType.startsWith('image/')) error(404, 'Gambar tidak ditemukan.');
	return new Response(upstream.body, {
		headers: {
			'Content-Type': contentType,
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
