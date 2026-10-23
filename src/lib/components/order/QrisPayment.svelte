<script lang="ts">
	import QRCode from 'qrcode';
	import { Download, LoaderCircle, QrCode } from '@lucide/svelte';
	import { formatRupiah } from '$lib/utils/format';

	let { qrString, total, orderUuid }: { qrString: string; total: number; orderUuid: string } = $props();

	let qrImage = $state('');
	$effect(() => {
		QRCode.toDataURL(qrString, { margin: 1, width: 640, errorCorrectionLevel: 'M' }).then((image) => (qrImage = image));
	});
</script>

<div class="flex flex-col items-center text-center">
	<span class="chip bg-background text-muted-foreground"><QrCode class="size-3.5" /> QRIS</span>
	<div class="mt-4 grid size-68 place-items-center rounded-3xl bg-white p-4 shadow-sm sm:size-80">
		{#if qrImage}
			<img src={qrImage} alt="QR code pembayaran" class="size-full" />
		{:else}
			<LoaderCircle class="size-6 animate-spin text-neutral-400" />
		{/if}
	</div>
	<p class="mt-4 font-mono text-2xl font-semibold tabular-nums">{formatRupiah(total)}</p>
	<p class="mt-1 max-w-xs text-sm text-muted-foreground">Scan dengan aplikasi e-wallet atau m-banking yang mendukung QRIS.</p>
	{#if qrImage}
		<a href={qrImage} download="qris-{orderUuid.slice(0, 8)}.png" class="btn btn-ghost mt-4">
			<Download class="size-4" /> Simpan QR
		</a>
	{/if}
</div>
