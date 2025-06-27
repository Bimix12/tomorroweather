export interface CurrentWeatherData {
  city: string;
  country: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface DailyForecast {
  date: string;
  dayOfWeek: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  icon: string;
}

export interface FullWeatherData {
  current: CurrentWeatherData;
  forecast: DailyForecast[];
}
