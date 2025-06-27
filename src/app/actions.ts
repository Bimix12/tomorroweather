'use server';
import type { FullWeatherData } from '@/lib/weather';
import { format } from 'date-fns';

// Overload signatures
export async function getWeatherForCity(city: string): Promise<FullWeatherData>;
export async function getWeatherForCity(lat: number, lon: number): Promise<FullWeatherData>;

// Implementation
export async function getWeatherForCity(query: string | number, lon?: number): Promise<FullWeatherData> {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('Weather API key is not configured.');
  }

  const searchQuery = typeof query === 'string' ? query : `${query},${lon}`;
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(searchQuery)}&days=7&aqi=no&alerts=no`;

  try {
    const response = await fetch(url, {
        next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400) {
            throw new Error(`Could not find weather for the specified location. Please try another.`);
        }
        throw new Error(errorData.error.message || `API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      current: {
        city: data.location.name,
        country: data.location.country,
        temperature: Math.round(data.current.temp_c),
        condition: data.current.condition.text,
        humidity: data.current.humidity,
        windSpeed: Math.round(data.current.wind_kph),
        icon: `https:${data.current.condition.icon}`,
      },
      forecast: data.forecast.forecastday.map((day: any) => ({
          date: day.date,
          dayOfWeek: format(new Date(day.date), 'EEE'),
          maxTemp: Math.round(day.day.maxtemp_c),
          minTemp: Math.round(day.day.mintemp_c),
          condition: day.day.condition.text,
          icon: `https:${day.day.condition.icon}`,
      }))
    };
  } catch (error: any) {
    console.error('getWeatherForCity error:', error.message);
    throw new Error(error.message || 'An unknown error occurred while fetching weather data.');
  }
}
