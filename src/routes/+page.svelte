<script lang="ts">
	import { onMount } from 'svelte';
	import { buildWeatherIconUrl } from '$lib/config/api';

	interface WeatherData {
		city: string;
		country: string;
		temperature: number;
		condition: string;
		description: string;
		humidity: number;
		windSpeed: number;
		pressure: number;
		icon: string;
		coords: {
			lat: number;
			lon: number;
		};
	}

	interface City {
		id: string; // Unique identifier for keying
		name: string;
		country: string;
		state?: string;
		displayName: string;
		coords: {
			lat: number;
			lon: number;
		};
	}

	let searchQuery = '';
	let weatherData: WeatherData | null = null;
	let isLoading = false;
	let isLoadingCities = false;
	let error = '';
	let cities: City[] = [];
	let showAutocomplete = false;
	let searchTimeout: ReturnType<typeof setTimeout>;
	let selectedIndex = -1; // For keyboard navigation
	let showNoResultsState = false;

	async function searchWeather(cityName: string) {
		if (!cityName.trim()) return;

		isLoading = true;
		error = '';
		showAutocomplete = false;
		showNoResultsState = false;

		try {
			const response = await fetch(`/api/weather?city=${encodeURIComponent(cityName)}`);
			const data = await response.json();

			if (!response.ok) {
				if (response.status === 404) {
					// City not found - show special UI
					showNoResultsState = true;
					weatherData = null;
				} else {
					throw new Error(data.error || 'Failed to fetch weather data');
				}
			} else {
				weatherData = data;
				showNoResultsState = false;
				// Update weather animation based on condition
				if (data.condition) {
					setTimeout(() => updateWeatherAnimation(data.condition), 100);
				}
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
			weatherData = null;
			showNoResultsState = false;
		} finally {
			isLoading = false;
		}
	}

	async function fetchCities(query: string) {
		if (query.length < 2) {
			cities = [];
			showAutocomplete = false;
			isLoadingCities = false;
			return;
		}

		isLoadingCities = true;
		showAutocomplete = true;

		try {
			const response = await fetch(`/api/cities?q=${encodeURIComponent(query)}`);
			const data = await response.json();

			if (response.ok) {
				cities = data.cities || [];
				selectedIndex = -1; // Reset keyboard selection
				showAutocomplete = cities.length > 0 || isLoadingCities;
			}
		} catch (err) {
			console.error('Failed to fetch cities:', err);
			cities = [];
			showAutocomplete = false;
		} finally {
			isLoadingCities = false;
		}
	}

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		searchQuery = target.value;

		// Debounce the city search
		clearTimeout(searchTimeout);
		if (searchQuery.trim()) {
			searchTimeout = setTimeout(() => {
				fetchCities(searchQuery);
			}, 200); // Reduced debounce time for faster response
		} else {
			cities = [];
			showAutocomplete = false;
		}
	}

	function selectCity(city: City) {
		searchQuery = city.name;
		showAutocomplete = false;
		cities = []; // Clear suggestions
		selectedIndex = -1; // Reset selection
		searchWeather(city.name);
	}

	function handleSearch() {
		if (searchQuery.trim()) {
			showAutocomplete = false;
			cities = []; // Clear suggestions when searching
			searchWeather(searchQuery);
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			if (showAutocomplete && selectedIndex >= 0 && cities[selectedIndex]) {
				event.preventDefault();
				selectCity(cities[selectedIndex]);
			} else {
				handleSearch();
			}
		} else if (event.key === 'Escape') {
			showAutocomplete = false;
			selectedIndex = -1;
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (showAutocomplete && cities.length > 0) {
				selectedIndex = selectedIndex < cities.length - 1 ? selectedIndex + 1 : 0;
			}
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (showAutocomplete && cities.length > 0) {
				selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : cities.length - 1;
			}
		}
	}

	function handleWindowClick(event: MouseEvent) {
		// Don't close if clicking inside the search area
		const target = event.target as HTMLElement;
		if (!target.closest('.search-container')) {
			showAutocomplete = false;
		}
	}

	// Weather animation functions
	function updateWeatherAnimation(condition: string) {
		const weatherBg = document.getElementById('weather-bg');
		if (!weatherBg) return;

		// Clear existing animations
		weatherBg.innerHTML = '';
		weatherBg.className = 'fixed inset-0 z-0 pointer-events-none';

		const conditionLower = condition.toLowerCase();

		if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
			createRainAnimation(weatherBg);
		} else if (conditionLower.includes('snow')) {
			createSnowAnimation(weatherBg);
		} else if (conditionLower.includes('cloud')) {
			createCloudAnimation(weatherBg);
		} else if (conditionLower.includes('clear') || conditionLower.includes('sun')) {
			createSunAnimation(weatherBg);
		} else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
			createThunderAnimation(weatherBg);
		}
	}

	function createRainAnimation(container: HTMLElement) {
		container.className += ' rain-bg';
		for (let i = 0; i < 100; i++) {
			const drop = document.createElement('div');
			drop.className = 'rain-drop';
			drop.style.left = Math.random() * 100 + '%';
			drop.style.animationDelay = Math.random() * 2 + 's';
			drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
			container.appendChild(drop);
		}
	}

	function createSnowAnimation(container: HTMLElement) {
		container.className += ' snow-bg';
		for (let i = 0; i < 50; i++) {
			const snowflake = document.createElement('div');
			snowflake.className = 'snowflake';
			snowflake.innerHTML = '❄';
			snowflake.style.left = Math.random() * 100 + '%';
			snowflake.style.animationDelay = Math.random() * 3 + 's';
			snowflake.style.fontSize = (Math.random() * 10 + 10) + 'px';
			container.appendChild(snowflake);
		}
	}

	function createCloudAnimation(container: HTMLElement) {
		container.className += ' cloud-bg';
		for (let i = 0; i < 5; i++) {
			const cloud = document.createElement('div');
			cloud.className = 'cloud';
			cloud.innerHTML = '☁️';
			cloud.style.left = Math.random() * 100 + '%';
			cloud.style.top = Math.random() * 50 + '%';
			cloud.style.animationDelay = Math.random() * 10 + 's';
			cloud.style.fontSize = (Math.random() * 20 + 30) + 'px';
			container.appendChild(cloud);
		}
	}

	function createSunAnimation(container: HTMLElement) {
		container.className += ' sun-bg';
		const sun = document.createElement('div');
		sun.className = 'sun';
		sun.innerHTML = '☀️';
		container.appendChild(sun);
	}

	function createThunderAnimation(container: HTMLElement) {
		container.className += ' thunder-bg';
		createRainAnimation(container); // Add rain with thunder

		// Add lightning flashes
		setInterval(() => {
			if (Math.random() < 0.1) { // 10% chance every second
				container.style.boxShadow = 'inset 0 0 100px rgba(255, 255, 255, 0.8)';
				setTimeout(() => {
					container.style.boxShadow = '';
				}, 100);
			}
		}, 1000);
	}

	// Load default weather for Berlin on mount
	onMount(() => {
		searchWeather('Berlin');
	});
</script>

<svelte:window on:click={handleWindowClick} />

<div class="flex flex-col items-center justify-center min-h-screen p-6 relative">
	<!-- Weather Background Animation Container -->
	<div id="weather-bg" class="fixed inset-0 z-0 pointer-events-none"></div>

	<!-- Glassmorphism Card -->
	<div class="w-full max-w-lg relative z-10 animate-fade-in">
		<div class="backdrop-blur-xl bg-white/90 dark:bg-gray-900/30 border border-white/50 dark:border-gray-700/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
			<!-- Glass effect overlay - enhanced for light theme -->
			<div class="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white/40 to-purple-50/60 dark:from-white/10 dark:to-transparent rounded-3xl"></div>
			<!-- Light theme enhancement -->
			<div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-blue-100/20 dark:hidden rounded-3xl"></div>
			<div class="relative z-10">
		<h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 text-center mb-4">
			Weather Dashboard
		</h1>

		<!-- Search Bar -->
		<div class="relative search-container">
			<div class="flex items-stretch bg-white/95 dark:bg-gray-800 rounded-xl border-2 border-blue-200/50 dark:border-gray-600 focus-within:border-blue-400 dark:focus-within:border-blue-500 shadow-lg backdrop-blur-sm transition-all duration-300">
				<div class="relative flex-1">
					<div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</div>
					<input
						type="text"
						placeholder="Search for any city worldwide..."
						bind:value={searchQuery}
						on:input={handleInput}
						on:keydown={handleKeydown}
						class="w-full pl-12 pr-4 py-4 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-lg"
						disabled={isLoading}
					/>
				</div>
				<button
					on:click={handleSearch}
					class="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 text-white font-semibold rounded-r-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 min-w-[120px] flex items-center justify-center"
					disabled={isLoading || !searchQuery.trim()}
				>
					{#if isLoading}
						<div class="flex items-center space-x-2">
							<div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
							<span>Loading</span>
						</div>
					{:else}
						<div class="flex items-center space-x-2">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
							</svg>
							<span>Search</span>
						</div>
					{/if}
				</button>
			</div>

			<!-- Autocomplete Dropdown -->
			{#if showAutocomplete}
				<div class="absolute z-20 w-full mt-2 bg-white/95 dark:bg-gray-800 border-2 border-blue-100/50 dark:border-gray-700 rounded-xl shadow-2xl backdrop-blur-md max-h-64 overflow-y-auto animate-slide-down">
					{#if isLoadingCities}
						<div class="p-4 flex items-center justify-center text-gray-500 dark:text-gray-400">
							<div class="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent mr-3"></div>
							<span>Searching cities...</span>
						</div>
					{:else if cities.length > 0}
						<div class="p-2">
							<div class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-3">
								Found {cities.length} cities • Use ↑↓ keys to navigate
							</div>
							{#each cities as city, index (city.id)}
								<button
									class="w-full text-left px-4 py-3 rounded-lg text-gray-900 dark:text-gray-100 transition-colors duration-200 flex items-center justify-between group {index === selectedIndex ? 'bg-blue-100/80 dark:bg-blue-900/50 border border-blue-300/60 dark:border-blue-700' : 'hover:bg-blue-50/80 dark:hover:bg-gray-700'}"
									on:click={() => selectCity(city)}
								>
									<div class="flex items-center space-x-3">
										<div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
											{city.country}
										</div>
										<div>
											<div class="font-medium">{city.name}</div>
											{#if city.state}
												<div class="text-sm text-gray-500 dark:text-gray-400">{city.state}</div>
											{/if}
										</div>
									</div>
									<div class="text-xs text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity {index === selectedIndex ? 'opacity-100' : ''}">
										{index === selectedIndex ? 'Press Enter' : 'Click to search'}
									</div>
								</button>
							{/each}
						</div>
					{:else}
						<div class="p-4 text-center text-gray-500 dark:text-gray-400">
							<div class="text-2xl mb-2">🌍</div>
							<div>No cities found. Try a different search term.</div>
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Error Message -->
		{#if error}
			<div class="mt-4 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg animate-fade-in">
				<p class="text-red-700 dark:text-red-300 text-sm">{error}</p>
			</div>
		{/if}

		<!-- No Results State -->
		{#if showNoResultsState}
			<div class="mt-8 text-center bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-2xl shadow-inner animate-fade-in border border-orange-100 dark:border-gray-600">
				<div class="text-6xl mb-4">🌍</div>
				<h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
					City Not Found
				</h3>
				<p class="text-gray-600 dark:text-gray-400 mb-4">
					We couldn't find weather data for "<span class="font-medium">{searchQuery}</span>"
				</p>
				<div class="text-sm text-gray-500 dark:text-gray-400 mb-4">
					Try searching for:
				</div>
				<div class="grid grid-cols-2 gap-2 text-sm">
					<button
						on:click={() => {searchQuery = 'New York'; searchWeather('New York');}}
						class="p-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
					>
						🗽 New York
					</button>
					<button
						on:click={() => {searchQuery = 'London'; searchWeather('London');}}
						class="p-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
					>
						🇬🇧 London
					</button>
					<button
						on:click={() => {searchQuery = 'Tokyo'; searchWeather('Tokyo');}}
						class="p-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
					>
						🗾 Tokyo
					</button>
					<button
						on:click={() => {searchQuery = 'Paris'; searchWeather('Paris');}}
						class="p-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
					>
						🇫🇷 Paris
					</button>
				</div>
			</div>
		<!-- Weather Display -->
		{:else if weatherData}
			<div class="mt-8 text-center bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-gray-700 dark:to-gray-800 p-6 rounded-2xl shadow-inner animate-fade-in border border-blue-200/40 dark:border-gray-600 backdrop-blur-sm">
				<div class="flex items-center justify-center space-x-2 mb-4">
					<div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
					<p class="text-lg font-medium text-gray-700 dark:text-gray-300">
						<span class="font-semibold">{weatherData.city}, {weatherData.country}</span>
					</p>
				</div>

				<div class="flex items-center justify-center space-x-4 mb-4">
					<img
						src={buildWeatherIconUrl(weatherData.icon, '4x')}
						alt={weatherData.description}
						class="w-20 h-20 drop-shadow-lg"
					/>
					<div class="text-center">
						<p class="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-1">
							{weatherData.temperature}°C
						</p>
						<p class="text-lg text-gray-600 dark:text-gray-400 capitalize font-medium">
							{weatherData.description}
						</p>
					</div>
				</div>

				<!-- Additional Weather Info -->
				<div class="grid md:grid-cols-3 grid-cols-1 gap-4 mt-6">
					<div class="bg-white/90 dark:bg-gray-800 rounded-xl p-4 shadow-md border border-blue-100/30 dark:border-gray-700 backdrop-blur-sm">
						<div class="flex items-center justify-center mb-2">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
							</svg>
						</div>
						<p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Humidity</p>
						<p class="text-lg font-bold text-gray-700 dark:text-gray-300">{weatherData.humidity}%</p>
					</div>
					<div class="bg-white/90 dark:bg-gray-800 rounded-xl p-4 shadow-md border border-blue-100/30 dark:border-gray-700 backdrop-blur-sm">
						<div class="flex items-center justify-center mb-2">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4L5.5 6M17 4l1.5 2M12 8v8m-4-4l8-8" />
							</svg>
						</div>
						<p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Wind</p>
						<p class="text-lg font-bold text-gray-700 dark:text-gray-300">{weatherData.windSpeed} m/s</p>
					</div>
					<div class="bg-white/90 dark:bg-gray-800 rounded-xl p-4 shadow-md border border-blue-100/30 dark:border-gray-700 backdrop-blur-sm">
						<div class="flex items-center justify-center mb-2">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Pressure</p>
						<p class="text-lg font-bold text-gray-700 dark:text-gray-300">{weatherData.pressure} hPa</p>
					</div>
				</div>
			</div>
		{:else if isLoading}
			<div class="mt-8 text-center bg-blue-50/60 dark:bg-gray-700 p-8 rounded-2xl shadow-inner backdrop-blur-sm border border-blue-100/30 dark:border-gray-600">
				<div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
				<p class="text-gray-600 dark:text-gray-400 font-medium">Loading weather data...</p>
			</div>
		{/if}
			</div>
		</div>
	</div>
</div>
