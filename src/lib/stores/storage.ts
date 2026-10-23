import { browser } from '$app/environment';

/** Reads JSON from localStorage; falls back when missing, blocked or on the server. */
export const readStorage = <T>(key: string, fallback: T): T => {
	if (!browser) return fallback;
	try {
		const raw = localStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : fallback;
	} catch {
		return fallback;
	}
};

export const writeStorage = (key: string, value: unknown) => {
	if (!browser) return;
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// Storage can be full or blocked; the value then lives for this tab only.
	}
};
