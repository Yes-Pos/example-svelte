<script lang="ts">
	import { CreditCard, ExternalLink } from '@lucide/svelte';
	import CopyButton from '$lib/components/common/CopyButton.svelte';
	import { formatRupiah } from '$lib/utils/format';

	let { link, total }: { link: string; total: number } = $props();
</script>

<div class="flex flex-col items-center text-center">
	<div class="grid size-14 place-items-center rounded-full bg-accent/15 text-accent">
		<CreditCard class="size-6" />
	</div>
	<p class="mt-4 font-mono text-2xl font-semibold tabular-nums">{formatRupiah(total)}</p>
	<p class="mt-1 max-w-xs text-sm text-muted-foreground">Buka link berikut di perangkat EDC untuk membayar dengan kartu.</p>
	<a href={link} target="_blank" rel="noopener noreferrer" class="btn btn-primary mt-4">
		<ExternalLink class="size-4" /> Buka pembayaran EDC
	</a>
	<div class="mt-3"><CopyButton value={link} label="Salin link" /></div>
</div>
