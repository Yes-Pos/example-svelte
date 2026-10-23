<script lang="ts">
	import { Minus, Plus } from '@lucide/svelte';

	let {
		value,
		min = 1,
		max = 999,
		onchange
	}: { value: number; min?: number; max?: number; onchange: (value: number) => void } = $props();
</script>

<div class="inline-flex items-center gap-0.5 rounded-full border border-border bg-background p-0.5">
	<button
		type="button"
		class="grid size-7 place-items-center rounded-full transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring disabled:text-muted-foreground/50 disabled:hover:bg-transparent"
		aria-label="Kurangi"
		disabled={value <= min}
		onclick={() => onchange(value - 1)}
	>
		<Minus class="size-3" />
	</button>
	<span class="min-w-6 text-center font-mono text-sm font-semibold tabular-nums">{value}</span>
	<button
		type="button"
		class="grid size-7 place-items-center rounded-full transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring disabled:text-muted-foreground/50 disabled:hover:bg-transparent"
		aria-label="Tambah"
		disabled={value >= max}
		onclick={() => onchange(value + 1)}
	>
		<Plus class="size-3" />
	</button>
</div>
