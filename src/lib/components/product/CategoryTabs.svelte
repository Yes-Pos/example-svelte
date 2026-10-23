<script lang="ts">
	import { categoryKey } from '$lib/utils/product';
	import type { ProductCategory } from '$lib/types';

	let { categories, active = $bindable('') }: { categories: ProductCategory[]; active?: string } = $props();

	const tabClass = (selected: boolean) =>
		`rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
			selected ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
		}`;
</script>

<div class="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Kategori">
	<div class="inline-flex gap-1 rounded-full border border-border bg-card p-1">
		<button type="button" role="tab" aria-selected={active === ''} class={tabClass(active === '')} onclick={() => (active = '')}>Semua</button>
		{#each categories as category (categoryKey(category))}
			{@const key = categoryKey(category)}
			<button type="button" role="tab" aria-selected={active === key} class={tabClass(active === key)} onclick={() => (active = key)}>
				{category.category_name}
				<span class="ml-1 font-mono text-xs opacity-60">{category.products.length}</span>
			</button>
		{/each}
	</div>
</div>
