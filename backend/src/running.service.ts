import mongoose from 'mongoose';
import { UBC_RUNNING_ROUTES } from './campus-routes';
import logger from './logger.util';
import { runningAchievementSchema, runningRouteSchema, runningSessionSchema } from './running.model';
import { CompleteRunningSessionRequest, CreateRunningSessionRequest, IRunningAchievement, IRunningRoute, IRunningSession } from './running.types';
import { WeatherService } from './weather.service';

export class RunningService {
  private runningRouteModel: mongoose.Model<IRunningRoute>;
  private runningSessionModel: mongoose.Model<IRunningSession>;
  private runningAchievementModel: mongoose.Model<IRunningAchievement>;
  private weatherService: WeatherService;

  constructor() {
    this.runningRouteModel = mongoose.model<IRunningRoute>('RunningRoute', runningRouteSchema);
    this.runningSessionModel = mongoose.model<IRunningSession>('RunningSession', runningSessionSchema);
    this.runningAchievementModel = mongoose.model<IRunningAchievement>('RunningAchievement', runningAchievementSchema);
    this.weatherService = new WeatherService();
    this.initializeRoutes();
  }

  private async initializeRoutes(): Promise<void> {
    try {
      const count = await this.runningRouteModel.countDocuments();
      if (count === 0) {
        await this.runningRouteModel.insertMany(UBC_RUNNING_ROUTES);
        logger.info('Initialized UBC running routes');
      }
    } catch (error) {
      logger.error('Failed to initialize running routes:', error);
    }
  }

  async getAllRoutes(): Promise<IRunningRoute[]> {
    try {
      return await this.runningRouteModel.find().sort({ difficulty: 1, distance: 1 });
    } catch (error) {
      logger.error('Failed to fetch running routes:', error);
      throw new Error('Failed to fetch running routes');
    }
  }

  async getRouteById(routeId: string): Promise<IRunningRoute | null> {
    try {
      return await this.runningRouteModel.findById(routeId);
    } catch (error) {
      logger.error('Failed to fetch running route:', error);
      throw new Error('Failed to fetch running route');
    }
  }

  async getWeatherForRunning(): Promise<any> {
    try {
      return await this.weatherService.getWeatherForUBC();
    } catch (error) {
      logger.error('Failed to fetch weather data:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  async startRunningSession(userId: string, request: CreateRunningSessionRequest): Promise<IRunningSession> {
    try {
      const route = await this.getRouteById(request.routeId);
      if (!route) {
        throw new Error('Route not found');
      }

      const weather = await this.weatherService.getWeatherForUBC();

      const session = new this.runningSessionModel({
        userId,
        routeId: request.routeId,
        startTime: request.startTime,
        weather: {
          temperature: weather.temperature,
          condition: weather.condition,
          humidity: weather.humidity,
        },
        gpsData: [],
        completed: false,
      });

      return await session.save();
    } catch (error) {
      logger.error('Failed to start running session:', error);
      throw new Error('Failed to start running session');
    }
  }

  async completeRunningSession(userId: string, request: CompleteRunningSessionRequest): Promise<IRunningSession> {
    try {
      const session = await this.runningSessionModel.findOne({
        _id: request.sessionId,
        userId,
        completed: false,
      });

      if (!session) {
        throw new Error('Running session not found or already completed');
      }

      const endTime = request.endTime;
      const duration = Math.floor((endTime.getTime() - session.startTime.getTime()) / 1000);
      
      // Calculate distance from GPS data
      const distance = this.calculateDistanceFromGPS(request.gpsData);
      
      // Calculate average pace (minutes per km)
      const averagePace = distance > 0 ? (duration / 60) / distance : 0;
      
      // Estimate calories (rough calculation)
      const calories = Math.round(distance * 60); // ~60 calories per km

      session.endTime = endTime;
      session.duration = duration;
      session.distance = distance;
      session.averagePace = averagePace;
      session.calories = calories;
      session.gpsData = request.gpsData;
      session.completed = true;

      const completedSession = await session.save();

      // Check for achievements
      await this.checkAchievements(userId, completedSession);

      return completedSession;
    } catch (error) {
      logger.error('Failed to complete running session:', error);
      throw new Error('Failed to complete running session');
    }
  }

  private calculateDistanceFromGPS(gpsData: { lat: number; lng: number; timestamp: Date }[]): number {
    if (gpsData.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 1; i < gpsData.length; i++) {
      const prev = gpsData[i - 1];
      const curr = gpsData[i];
      totalDistance += this.haversineDistance(prev.lat, prev.lng, curr.lat, curr.lng);
    }

    return totalDistance;
  }

  private haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  async getUserSessions(userId: string, limit: number = 10): Promise<IRunningSession[]> {
    try {
      return await this.runningSessionModel
        .find({ userId, completed: true })
        .sort({ endTime: -1 })
        .limit(limit)
        .populate('routeId');
    } catch (error) {
      logger.error('Failed to fetch user sessions:', error);
      throw new Error('Failed to fetch user sessions');
    }
  }

  async getUserAchievements(userId: string): Promise<IRunningAchievement[]> {
    try {
      return await this.runningAchievementModel
        .find({ userId })
        .sort({ unlockedAt: -1 });
    } catch (error) {
      logger.error('Failed to fetch user achievements:', error);
      throw new Error('Failed to fetch user achievements');
    }
  }

  private async checkAchievements(userId: string, session: IRunningSession): Promise<void> {
    try {
      const achievements = [];

      // Distance achievements
      const totalDistance = await this.getTotalDistance(userId);
      if (totalDistance >= 50 && !(await this.hasAchievement(userId, 'distance_50km'))) {
        achievements.push({
          userId,
          type: 'distance',
          title: 'Distance Master',
          description: 'Run a total of 50km',
          icon: '🏃‍♂️',
          unlockedAt: new Date(),
          metadata: { distance: totalDistance },
        });
      }

      // Speed achievements
      if (session.averagePace <= 5 && !(await this.hasAchievement(userId, 'speed_5min'))) {
        achievements.push({
          userId,
          type: 'speed',
          title: 'Speed Demon',
          description: 'Run at 5 min/km pace or faster',
          icon: '⚡',
          unlockedAt: new Date(),
          metadata: { pace: session.averagePace },
        });
      }

      // Weather achievements
      if (session.weather.condition === 'Rain' && !(await this.hasAchievement(userId, 'weather_rain'))) {
        achievements.push({
          userId,
          type: 'weather',
          title: 'Rain Runner',
          description: 'Complete a run in the rain',
          icon: '🌧️',
          unlockedAt: new Date(),
          metadata: { condition: session.weather.condition },
        });
      }

      if (achievements.length > 0) {
        await this.runningAchievementModel.insertMany(achievements);
        logger.info(`Unlocked ${achievements.length} achievements for user ${userId}`);
      }
    } catch (error) {
      logger.error('Failed to check achievements:', error);
    }
  }

  private async getTotalDistance(userId: string): Promise<number> {
    const result = await this.runningSessionModel.aggregate([
      { $match: { userId, completed: true } },
      { $group: { _id: null, totalDistance: { $sum: '$distance' } } },
    ]);
    return result[0]?.totalDistance || 0;
  }

  private async hasAchievement(userId: string, achievementKey: string): Promise<boolean> {
    const count = await this.runningAchievementModel.countDocuments({
      userId,
      'metadata.key': achievementKey,
    });
    return count > 0;
  }
}
