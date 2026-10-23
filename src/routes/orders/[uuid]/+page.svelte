<script lang="ts">
	import { page } from '$app/state';
	import OrderDetailView from '$lib/views/OrderDetailView.svelte';
</script>

<svelte:head>
	<title>Detail pesanan</title>
</svelte:head>

<OrderDetailView uuid={page.params.uuid ?? ''} />
