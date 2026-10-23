<script lang="ts">
	import { page } from '$app/state';
	import ProductDetailView from '$lib/views/ProductDetailView.svelte';
</script>

<ProductDetailView uuid={page.params.uuid ?? ''} />
