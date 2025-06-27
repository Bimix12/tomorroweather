'use client';

import type { CurrentWeatherData } from '@/lib/weather';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, Wind } from 'lucide-react';
import Image from 'next/image';

export function WeatherCard({ weather }: { weather: CurrentWeatherData }) {
    if (!weather) return null;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">{weather.city}</CardTitle>
                {weather.icon && (
                    <Image 
                        src={weather.icon} 
                        alt={weather.condition} 
                        width={48} 
                        height={48}
                        className="w-12 h-12"
                    />
                )}
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold">{weather.temperature}°C</div>
                <p className="text-sm text-muted-foreground capitalize">{weather.condition}</p>
                <div className="mt-4 flex space-x-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Droplets className="h-4 w-4" />
                        <span>{weather.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Wind className="h-4 w-4" />
                        <span>{weather.windSpeed} km/h</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
