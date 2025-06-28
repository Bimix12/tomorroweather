'use client';

import { useCallback, useEffect, useState } from 'react';
import type { FullWeatherData } from '../lib/weather';
import { getWeatherForCity } from '../app/actions';
import { Card, CardContent, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Globe, Loader2, AlertCircle, Star } from 'lucide-react';
import { WeatherCard } from './weather-card';
import { Separator } from './ui/separator';
import { Skeleton } from './ui/skeleton';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { ForecastDisplay } from './forecast-display';

const FEATURED_CITIES = ['Tokyo', 'Paris', 'London', 'New York', 'Dubai', 'Rome', 'Singapore', 'Barcelona', 'Los Angeles', 'Sydney', 'Istanbul', 'Bangkok', 'Amsterdam', 'Prague', 'Seoul', 'Hong Kong', 'Cairo', 'Rio de Janeiro', 'Moscow', 'Berlin', 'Toronto', 'San Francisco', 'Las Vegas', 'Madrid', 'Chicago', 'Vienna', 'Shanghai', 'Mexico City', 'Mumbai', 'Buenos Aires'];

export function WeatherMap() {
  const [displayWeather, setDisplayWeather] = useState<FullWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const [featuredCities, setFeaturedCities] = useState<(FullWeatherData | null)[]>([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  
  const fetchWeatherByGeolocation = useCallback(() => {
    setIsLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser. Please use the search bar.");
      setIsLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const weather = await getWeatherForCity(position.coords.latitude, position.coords.longitude);
          setDisplayWeather(weather);
          setError(null);
        } catch (err: any) {
          setError(err.message || 'Could not fetch weather for your location.');
          setDisplayWeather(null);
        } finally {
          setIsLoading(false);
        }
      },
      (geoError) => {
        console.error("Geolocation error:", geoError);
        let errorMessage = "Location access was denied. Please enable it in your browser settings and refresh.";
        if (geoError.code === geoError.POSITION_UNAVAILABLE) errorMessage = "Your location is currently unavailable.";
        else if (geoError.code === geoError.TIMEOUT) errorMessage = "Request for your location timed out.";
        
        setError(errorMessage);
        setDisplayWeather(null);
        setIsLoading(false);
      }
    );
  }, []);
  
  useEffect(() => {
    // fetchWeatherByGeolocation(); // Removed to prevent automatic fetch on load.
    
    const fetchFeaturedCities = async (initialLoad = false) => {
        if (initialLoad) setIsLoadingFeatured(true);
        const weatherPromises = FEATURED_CITIES.map(city => 
            getWeatherForCity(city).catch(err => {
                console.error(`Failed to fetch weather for ${city}:`, err);
                return null;
            })
        );
        const results = await Promise.all(weatherPromises);
        const newResults = results.filter(Boolean) as FullWeatherData[];
        if (newResults.length > 0) {
            setFeaturedCities(newResults);
        }
        if (initialLoad) setIsLoadingFeatured(false);
    };

    fetchFeaturedCities(true);
    const intervalId = setInterval(() => fetchFeaturedCities(false), 3600 * 1000);

    return () => clearInterval(intervalId);
  }, [/* fetchWeatherByGeolocation */]); // Removed dependency
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setIsLoading(true);
    setError(null);
    
    try {
      const weather = await getWeatherForCity(searchQuery);
      setDisplayWeather(weather);
      setError(null);
    } catch(err: any) {
      setError(err.message || 'Could not fetch weather for the specified location.');
      setDisplayWeather(null);
    } finally {
      setIsSearching(false);
      setIsLoading(false);
    }
  };

  const handleFeaturedCityClick = (city: string) => {
    setSearchQuery(city);
    const form = document.getElementById('search-form') as HTMLFormElement;
    if (form) {
        form.requestSubmit();
    }
  };

  const renderMainDisplay = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[280px]">
          <Loader2 className="animate-spin text-primary h-8 w-8" />
          <p className="text-muted-foreground mt-2 font-semibold">
            Loading Weather Data...
          </p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex items-start gap-3 text-sm text-destructive p-3 bg-destructive/10 rounded-md min-h-[280px] justify-center flex-col text-center">
            <div className='mx-auto'>
                <AlertCircle className="h-8 w-8 mx-auto" />
            </div>
            <span className='mx-auto'>{error}</span>
        </div>
      );
    }

    if (displayWeather) {
      return (
        <div>
          <WeatherCard weather={displayWeather.current} />
          <ForecastDisplay forecast={displayWeather.forecast} />
        </div>
      );
    }
    
    return (
        <div className="flex flex-col items-center justify-center text-center h-full min-h-[280px] p-4 text-muted-foreground">
          <Globe className="w-20 h-20 text-primary/20 mb-4" />
          <h3 className="text-xl font-semibold text-foreground">Welcome to Tomorrow Weather</h3>
          <p className="mt-2 max-w-sm">
            Use the search bar above to find a city, or click the globe icon to get the weather for your current location.
          </p>
        </div>
    );
  };

  return (
    <Card className="w-full shadow-lg flex flex-col">
      <CardHeader>
        <form onSubmit={handleSearch} id="search-form" className="flex gap-2 w-full">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    id="city-search"
                    placeholder="Search for a city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={isSearching || isLoading}
                    className="pl-9"
                />
            </div>
            <Button type="submit" variant="secondary" disabled={isSearching || isLoading || !searchQuery.trim()}>
                {isSearching ? <Loader2 className="animate-spin" /> : <span>Search</span>}
            </Button>
            <Button type="button" variant="outline" size="icon" title="Get my location's weather" onClick={fetchWeatherByGeolocation} disabled={isSearching || isLoading}>
                <Globe />
            </Button>
        </form>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-6 pt-6">
        
        <div className="min-h-[280px]">
            {renderMainDisplay()}
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Star className="w-5 h-5 text-accent" />
            <span>Featured Cities</span>
          </h3>
          {isLoadingFeatured ? (
            <div className="flex space-x-2 overflow-hidden p-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-1/2 md:w-1/4 flex-shrink-0">
                  <Card className="p-3 h-full">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-8 w-1/2" />
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <Carousel
              opts={{ align: "start", loop: false }}
              className="w-full"
            >
              <CarouselContent className="-ml-2">
                {featuredCities.map((weather) => weather && (
                  <CarouselItem key={weather.current.city} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 pl-2">
                      <Card 
                          className="p-3 cursor-pointer hover:bg-muted/50 transition-colors flex flex-col justify-between h-full"
                          onClick={() => handleFeaturedCityClick(weather.current.city)}
                      >
                          <div className="flex justify-between items-start">
                              <p className="font-semibold text-sm pr-1 truncate">{weather.current.city}</p>
                              {weather.current.icon && <Image src={weather.current.icon} alt={weather.current.condition} width={24} height={24} className="flex-shrink-0"/>}
                          </div>
                          <div>
                              <p className="text-2xl font-bold">{weather.current.temperature}°C</p>
                              <p className="text-xs text-muted-foreground capitalize truncate">{weather.current.condition}</p>
                          </div>
                      </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
