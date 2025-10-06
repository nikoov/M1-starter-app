import { Document } from 'mongoose';

export interface IRunningRoute extends Document {
  _id: string;
  name: string;
  description: string;
  distance: number; // in kilometers
  difficulty: 'Easy' | 'Medium' | 'Hard';
  landmarks: string[];
  coordinates: {
    start: { lat: number; lng: number };
    waypoints: { lat: number; lng: number; name: string }[];
    end: { lat: number; lng: number };
  };
  estimatedTime: number; // in minutes
  weatherDependent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRunningSession extends Document {
  _id: string;
  userId: string;
  routeId: string;
  startTime: Date;
  endTime?: Date;
  distance: number; // actual distance covered
  duration: number; // in seconds
  averagePace: number; // minutes per km
  calories: number;
  weather: {
    temperature: number;
    condition: string;
    humidity: number;
  };
  gpsData: {
    lat: number;
    lng: number;
    timestamp: Date;
  }[];
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRunningAchievement extends Document {
  _id: string;
  userId: string;
  type: 'distance' | 'streak' | 'route' | 'weather' | 'speed';
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  metadata: Record<string, any>;
}

export interface CreateRunningSessionRequest {
  routeId: string;
  startTime: Date;
}

export interface CompleteRunningSessionRequest {
  sessionId: string;
  endTime: Date;
  gpsData: {
    lat: number;
    lng: number;
    timestamp: Date;
  }[];
}

export interface RunningSessionResponse {
  session: IRunningSession;
  route: IRunningRoute;
  achievements: IRunningAchievement[];
}

export interface WeatherCondition {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  isGoodForRunning: boolean;
  recommendations: string[];
}

export interface CampusRouteResponse {
  routes: IRunningRoute[];
  weather: WeatherCondition;
  recommendations: string[];
}
