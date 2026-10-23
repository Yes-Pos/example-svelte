<script lang="ts">
	import { onMount } from 'svelte';

	let { until }: { until: string } = $props();

	let now = $state(Date.now());
	onMount(() => {
		const timer = setInterval(() => (now = Date.now()), 1000);
		return () => clearInterval(timer);
	});

	const remaining = $derived(Math.max(0, new Date(until).getTime() - now));
	const pad = (value: number) => String(value).padStart(2, '0');
	const text = $derived(
		`${pad(Math.floor(remaining / 3_600_000))}:${pad(Math.floor((remaining % 3_600_000) / 60_000))}:${pad(Math.floor((remaining % 60_000) / 1000))}`
	);
</script>

<span class="font-mono tabular-nums">{remaining > 0 ? text : 'Kedaluwarsa'}</span>
