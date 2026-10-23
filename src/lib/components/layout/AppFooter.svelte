<script lang="ts">
	let { storeName }: { storeName: string } = $props();
</script>

<footer class="border-t border-border">
	<div class="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
		<span>© {new Date().getFullYear()} {storeName}</span>
		<span>Pembayaran diproses oleh YesPOS &amp; iPaymu</span>
	</div>
</footer>
