import axios from 'axios';
import logger from './logger.util';
import { WeatherCondition } from './running.types';

export class WeatherService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY || '';
    if (!this.apiKey) {
      logger.warn('OpenWeather API key not provided. Weather features will be limited.');
    }
  }

  async getWeatherForLocation(lat: number, lng: number): Promise<WeatherCondition> {
    if (!this.apiKey) {
      return this.getDefaultWeatherCondition();
    }

    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat,
          lon: lng,
          appid: this.apiKey,
          units: 'metric',
        },
        timeout: 5000,
      });

      const data = response.data;
      const temperature = Math.round(data.main.temp);
      const condition = data.weather[0].main;
      const humidity = data.main.humidity;
      const windSpeed = data.wind?.speed || 0;
      const description = data.weather[0].description;
      const icon = data.weather[0].icon;

      return {
        temperature,
        condition,
        humidity,
        windSpeed,
        description,
        icon,
        isGoodForRunning: this.isGoodRunningWeather(temperature, condition, humidity, windSpeed),
        recommendations: this.getRunningRecommendations(temperature, condition, humidity, windSpeed),
      };
    } catch (error) {
      logger.error('Failed to fetch weather data:', error);
      return this.getDefaultWeatherCondition();
    }
  }

  private isGoodRunningWeather(temperature: number, condition: string, humidity: number, windSpeed: number): boolean {
    // Good running conditions
    const goodTemp = temperature >= 5 && temperature <= 25; // 5°C to 25°C
    const goodCondition = !['Rain', 'Thunderstorm', 'Snow', 'Extreme'].includes(condition);
    const goodHumidity = humidity <= 80;
    const goodWind = windSpeed <= 20; // km/h

    return goodTemp && goodCondition && goodHumidity && goodWind;
  }

  private getRunningRecommendations(temperature: number, condition: string, humidity: number, windSpeed: number): string[] {
    const recommendations: string[] = [];

    if (temperature < 5) {
      recommendations.push('Dress warmly - consider indoor routes');
    } else if (temperature > 25) {
      recommendations.push('Stay hydrated - bring water');
    }

    if (condition === 'Rain') {
      recommendations.push('Wear waterproof gear or choose indoor routes');
    } else if (condition === 'Snow') {
      recommendations.push('Be careful of slippery surfaces');
    }

    if (humidity > 80) {
      recommendations.push('High humidity - take it easy and stay hydrated');
    }

    if (windSpeed > 15) {
      recommendations.push('Strong winds - consider sheltered routes');
    }

    if (recommendations.length === 0) {
      recommendations.push('Perfect weather for running!');
    }

    return recommendations;
  }

  private getDefaultWeatherCondition(): WeatherCondition {
    return {
      temperature: 15,
      condition: 'Clear',
      humidity: 60,
      windSpeed: 5,
      description: 'Clear sky',
      icon: '01d',
      isGoodForRunning: true,
      recommendations: ['Perfect weather for running!'],
    };
  }

  async getWeatherForUBC(): Promise<WeatherCondition> {
    // UBC Vancouver coordinates
    const ubcLat = 49.2606;
    const ubcLng = -123.2460;
    return this.getWeatherForLocation(ubcLat, ubcLng);
  }
}
