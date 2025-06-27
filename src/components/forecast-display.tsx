'use client';

import type { DailyForecast } from '../lib/weather';
import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';

export function ForecastDisplay({ forecast }: { forecast: DailyForecast[] }) {
    if (!forecast || forecast.length === 0) return null;

    return (
        <Card className="mt-2">
            <CardContent className="p-4">
                <h3 className="text-base font-semibold mb-3 text-center">7-Day Forecast</h3>
                <div className="space-y-3">
                    {forecast.map((day, index) => (
                        <div key={day.date}>
                            <div className="flex items-center justify-between gap-2 sm:gap-4">
                                <p className="font-semibold w-12 text-sm">{index === 0 ? 'Today' : day.dayOfWeek}</p>
                                <Image 
                                    src={day.icon} 
                                    alt={day.condition} 
                                    width={32} 
                                    height={32}
                                    className="w-8 h-8"
                                />
                                <p className="text-xs text-muted-foreground flex-1 truncate hidden sm:block" title={day.condition}>{day.condition}</p>
                                <p className="font-medium text-right w-20 text-sm">
                                    {day.maxTemp}° / {day.minTemp}°
                                </p>
                            </div>
                            {index < forecast.length - 1 && <Separator className="mt-3" />}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
