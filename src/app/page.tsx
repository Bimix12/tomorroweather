import { CloudSun } from 'lucide-react';
import { WeatherMap } from '@/components/weather-map';

export default function Home() {
  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-8">
        <div className="inline-flex items-center gap-3">
          <CloudSun className="w-12 h-12 text-primary" />
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
            Tomorrow Weather
          </h1>
        </div>
      </header>
      <div className="max-w-2xl mx-auto">
        <WeatherMap />
      </div>
    </main>
  );
}
