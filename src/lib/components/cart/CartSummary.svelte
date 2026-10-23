<script lang="ts">
	import { LoaderCircle, ShieldCheck, TriangleAlert } from '@lucide/svelte';
	import { formatRupiah } from '$lib/utils/format';

	let {
		count,
		total,
		error,
		submitting,
		disabled
	}: { count: number; total: number; error?: string; submitting: boolean; disabled: boolean } = $props();
</script>

<section class="flex flex-col gap-3 rounded-3xl bg-muted/50 p-4">
	<div class="flex justify-between text-xs text-muted-foreground">
		<span>{count} barang</span>
		<span class="font-mono tabular-nums">{formatRupiah(total)}</span>
	</div>
	<div class="flex items-baseline justify-between border-t border-border pt-3">
		<span class="text-sm font-medium">Total</span>
		<span class="font-mono text-lg font-semibold tabular-nums">{formatRupiah(total)}</span>
	</div>
	{#if error}
		<p class="flex gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive" role="alert" data-checkout-error>
			<TriangleAlert class="size-3.5 flex-shrink-0" />
			{error}
		</p>
	{/if}
	<button type="submit" class="btn btn-primary w-full py-3" disabled={submitting || disabled}>
		{#if submitting}<LoaderCircle class="size-4 animate-spin" /> Memproses...{:else}Bayar {formatRupiah(total)}{/if}
	</button>
	<p class="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
		<ShieldCheck class="size-3.5" /> Harga dihitung ulang oleh server saat order
	</p>
</section>
