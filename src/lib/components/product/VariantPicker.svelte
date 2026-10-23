<script lang="ts">
	import { Check } from '@lucide/svelte';
	import { formatRupiah } from '$lib/utils/format';
	import type { ProductVariant } from '$lib/types';

	let {
		variants,
		trackStock,
		value = $bindable('')
	}: { variants: ProductVariant[]; trackStock: boolean; value?: string } = $props();

	const available = (variant: ProductVariant) => !trackStock || variant.current_stock > 0;
</script>

<fieldset>
	<legend class="label">Pilih varian</legend>
	<div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
		{#each variants as option (option.uuid)}
			{@const canPick = available(option)}
			<label
				class="relative flex cursor-pointer flex-col rounded-2xl border px-3.5 py-2.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring
					{value === option.uuid ? 'border-foreground bg-background' : 'border-border hover:border-border-strong'}
					{canPick ? '' : 'cursor-not-allowed opacity-45'}"
			>
				<input type="radio" name="variant" value={option.uuid} bind:group={value} disabled={!canPick} class="sr-only" />
				<span class="text-sm font-medium">{option.name}</span>
				<span class="font-mono text-xs text-muted-foreground tabular-nums">{canPick ? formatRupiah(option.price) : 'Habis'}</span>
				{#if value === option.uuid}
					<span class="absolute top-2 right-2 grid size-4 place-items-center rounded-full bg-foreground text-background">
						<Check class="size-2.5" />
					</span>
				{/if}
			</label>
		{/each}
	</div>
</fieldset>
