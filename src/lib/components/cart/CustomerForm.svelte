<script lang="ts">
	import type { Customer } from '$lib/types';

	let { customer = $bindable() }: { customer: Customer } = $props();
</script>

<section class="card p-4">
	<h2 class="text-sm font-semibold">Data pembeli</h2>
	<div class="mt-3 flex flex-col gap-3">
		<label>
			<span class="label">Nama</span>
			<input class="field" name="name" autocomplete="name" required bind:value={customer.name} />
		</label>
		<div class="grid grid-cols-2 gap-3">
			<label>
				<span class="label">No. HP</span>
				<input class="field" name="phone" type="tel" autocomplete="tel" required bind:value={customer.phone} />
			</label>
			<label>
				<span class="label">Email</span>
				<input class="field" name="email" type="email" autocomplete="email" required bind:value={customer.email} />
			</label>
		</div>
	</div>
</section>
