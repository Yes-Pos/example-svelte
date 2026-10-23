import { browser } from '$app/environment';

/** Light/dark theme; app.html applies the saved one before paint. */
class ThemeStore {
	dark = $state(false);

	/** Reads the theme app.html applied; call once mounted. */
	sync() {
		if (browser) this.dark = document.documentElement.classList.contains('dark');
	}

	toggle() {
		this.dark = !this.dark;
		document.documentElement.classList.toggle('dark', this.dark);
		try {
			localStorage.setItem('theme', this.dark ? 'dark' : 'light');
		} catch {
			// The theme then resets on reload.
		}
	}
}

export const theme = new ThemeStore();
