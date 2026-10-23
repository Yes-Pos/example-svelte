<script lang="ts">
	import { page } from '$app/state';
	import MessageView from '$lib/views/MessageView.svelte';
</script>

<MessageView
	code={page.status}
	title={page.status === 404 ? 'Halaman tidak ditemukan' : 'Terjadi kesalahan'}
	message={page.error?.message}
>
	<a href="/" class="btn btn-primary">Kembali ke toko</a>
</MessageView>
