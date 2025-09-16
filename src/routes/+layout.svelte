<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';

	let darkMode = false;

	onMount(() => {
		// Check for saved theme preference or default to light mode
		const savedTheme = localStorage.getItem('theme');
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

		darkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);
		updateTheme();
	});

	function toggleTheme() {
		darkMode = !darkMode;
		updateTheme();
		localStorage.setItem('theme', darkMode ? 'dark' : 'light');
	}

	function updateTheme() {
		if (darkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}
</script>

<svelte:head>
	<title>Weather Dashboard</title>
	<meta name="description" content="A beautiful weather dashboard built with SvelteKit" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
	<!-- Theme Toggle -->
	<div class="absolute top-4 right-4 z-20">
		<button
			on:click={toggleTheme}
			class="theme-toggle"
			aria-label="Toggle dark mode"
		>
			{#if darkMode}
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
				</svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
				</svg>
			{/if}
		</button>
	</div>

	<slot />
</div>
