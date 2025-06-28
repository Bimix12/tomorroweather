import { CloudSun, AlertTriangle } from 'lucide-react';
import { WeatherMap } from '../components/weather-map';
import { Card, CardContent } from '../components/ui/card';

export default function Home() {
  const apiKey = process.env.WEATHER_API_KEY;

  const renderContent = () => {
    if (!apiKey) {
      return (
        <Card className="mt-8 border-destructive bg-destructive/10">
          <CardContent className="p-6 flex flex-col items-center text-center text-destructive">
            <AlertTriangle className="w-12 h-12 mb-4" />
            <h2 className="text-xl font-bold">Configuration Error</h2>
            <p className="mt-2">
              The Weather API key is missing. Please add the <code>WEATHER_API_KEY</code> to your environment variables in your deployment settings (e.g., on Netlify or Vercel).
            </p>
            <p className="mt-4 text-sm">
              The application cannot fetch weather data without a valid API key.
            </p>
          </CardContent>
        </Card>
      );
    }
    return <WeatherMap />;
  };

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
        {renderContent()}
      </div>
    </main>
  );
}
