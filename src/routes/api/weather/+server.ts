import { json } from '@sveltejs/kit';
import { OPEN_WEATHER_MAP_API } from '$env/static/private';
import { buildWeatherUrl } from '$lib/config/api';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const city = url.searchParams.get('city');

	if (!city) {
		return json(
			{ error: 'City parameter is required' },
			{ status: 400 }
		);
	}

	if (!OPEN_WEATHER_MAP_API) {
		return json(
			{ error: 'OpenWeatherMap API key not configured' },
			{ status: 500 }
		);
	}

	try {
		const weatherUrl = buildWeatherUrl(city, OPEN_WEATHER_MAP_API);
		const response = await fetch(weatherUrl);

		if (!response.ok) {
			if (response.status === 404) {
				return json(
					{ error: `City "${city}" not found` },
					{ status: 404 }
				);
			}
			throw new Error(`Weather API returned ${response.status}`);
		}

		const data = await response.json();

		// Transform the API response to match our expected format
		const weatherData = {
			city: data.name,
			country: data.sys.country,
			temperature: Math.round(data.main.temp),
			condition: data.weather[0].main,
			description: data.weather[0].description,
			humidity: data.main.humidity,
			windSpeed: data.wind.speed,
			pressure: data.main.pressure,
			icon: data.weather[0].icon,
			coords: {
				lat: data.coord.lat,
				lon: data.coord.lon
			}
		};

		return json(weatherData);

	} catch (error) {
		console.error('Weather API error:', error);
		return json(
			{ error: 'Failed to fetch weather data' },
			{ status: 500 }
		);
	}
};