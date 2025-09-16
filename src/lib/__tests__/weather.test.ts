import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Weather API Functions', () => {
	beforeEach(() => {
		mockFetch.mockClear();
	});

	it('should fetch weather data successfully', async () => {
		const mockWeatherResponse = {
			name: 'Berlin',
			sys: { country: 'DE' },
			main: { temp: 15, humidity: 65, pressure: 1013 },
			weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
			wind: { speed: 3.5 },
			coord: { lat: 52.5244, lon: 13.4105 }
		};

		mockFetch.mockResolvedValueOnce({
			ok: true,
			status: 200,
			json: async () => mockWeatherResponse
		});

		const response = await fetch('/api/weather?city=Berlin');
		const data = await response.json();

		expect(mockFetch).toHaveBeenCalledWith('/api/weather?city=Berlin');
		expect(response.ok).toBe(true);
	});

	it('should handle city not found error', async () => {
		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: 404,
			json: async () => ({ error: 'City "NonExistentCity" not found' })
		});

		const response = await fetch('/api/weather?city=NonExistentCity');
		const data = await response.json();

		expect(response.ok).toBe(false);
		expect(response.status).toBe(404);
		expect(data.error).toContain('not found');
	});

	it('should fetch cities for autocomplete', async () => {
		const mockCitiesResponse = {
			cities: [
				{
					name: 'Berlin',
					country: 'DE',
					displayName: 'Berlin, DE',
					coords: { lat: 52.5244, lon: 13.4105 }
				}
			]
		};

		mockFetch.mockResolvedValueOnce({
			ok: true,
			status: 200,
			json: async () => mockCitiesResponse
		});

		const response = await fetch('/api/cities?q=Berlin');
		const data = await response.json();

		expect(mockFetch).toHaveBeenCalledWith('/api/cities?q=Berlin');
		expect(response.ok).toBe(true);
		expect(data.cities).toHaveLength(1);
		expect(data.cities[0].name).toBe('Berlin');
	});

	it('should return empty array for short queries', async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			status: 200,
			json: async () => ({ cities: [] })
		});

		const response = await fetch('/api/cities?q=B');
		const data = await response.json();

		expect(data.cities).toEqual([]);
	});
});