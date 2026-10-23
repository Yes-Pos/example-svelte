<script lang="ts">
	import { Check, Copy } from '@lucide/svelte';

	let { value, label = 'Salin' }: { value: string; label?: string } = $props();
	let copied = $state(false);

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(value);
			copied = true;
			setTimeout(() => (copied = false), 1500);
		} catch {
			// Clipboard can be blocked; the value stays selectable on the page.
		}
	};
</script>

<button type="button" class="btn btn-ghost px-3 py-1.5 text-xs" onclick={copy} aria-live="polite">
	{#if copied}<Check class="size-3.5 text-success" /> Tersalin{:else}<Copy class="size-3.5" /> {label}{/if}
</button>
