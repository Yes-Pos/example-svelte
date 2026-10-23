import { errorMessage } from '$lib/services/api';
import { getShop, type ShopInfo } from '$lib/services/shop.service';

/** The shop name and outlet, loaded once for the whole app. */
class ShopStore {
	info = $state<ShopInfo | null>(null);
	loading = $state(true);
	error = $state('');

	async load() {
		this.loading = true;
		this.error = '';
		try {
			this.info = await getShop();
		} catch (err) {
			this.error = errorMessage(err);
		} finally {
			this.loading = false;
		}
	}
}

export const shop = new ShopStore();
