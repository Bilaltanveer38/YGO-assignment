import { json } from '@sveltejs/kit';
import { OPEN_WEATHER_MAP_API } from '$env/static/private';
import { buildGeocodingUrl } from '$lib/config/api';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const query = url.searchParams.get('q');

	if (!query || query.length < 2) {
		return json({ cities: [] });
	}

	if (!OPEN_WEATHER_MAP_API) {
		return json(
			{ error: 'OpenWeatherMap API key not configured' },
			{ status: 500 }
		);
	}

	try {
		const geocodingUrl = buildGeocodingUrl(query, OPEN_WEATHER_MAP_API, 5);
		const response = await fetch(geocodingUrl);

		if (!response.ok) {
			throw new Error(`Geocoding API returned ${response.status}`);
		}

		const data = await response.json();

		// Process and deduplicate cities
		const cityMap = new Map();

		data.forEach((item: any) => {
			const displayName = `${item.name}${item.state ? ', ' + item.state : ''}, ${item.country}`;
			const uniqueKey = `${item.name}-${item.state || ''}-${item.country}`;

			// Only add if we haven't seen this exact combination before
			if (!cityMap.has(uniqueKey)) {
				cityMap.set(uniqueKey, {
					id: uniqueKey, // Add unique ID for Svelte keying
					name: item.name,
					country: item.country,
					state: item.state,
					displayName,
					coords: {
						lat: item.lat,
						lon: item.lon
					}
				});
			}
		});

		const cities = Array.from(cityMap.values());
		return json({ cities });

	} catch (error) {
		console.error('Cities API error:', error);
		return json(
			{ error: 'Failed to fetch cities' },
			{ status: 500 }
		);
	}
};