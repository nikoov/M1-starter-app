import { NextFunction, Request, Response } from 'express';
import logger from './logger.util';
import { RunningService } from './running.service';
import { CompleteRunningSessionRequest, CreateRunningSessionRequest } from './running.types';

export class RunningController {
  private runningService: RunningService;

  constructor() {
    this.runningService = new RunningService();
  }

  async getAllRoutes(req: Request, res: Response, next: NextFunction) {
    try {
      const routes = await this.runningService.getAllRoutes();
      const weather = await this.runningService.getWeatherForRunning();

      res.status(200).json({
        message: 'Running routes fetched successfully',
        data: {
          routes,
          weather,
          recommendations: weather.recommendations,
        },
      });
    } catch (error) {
      logger.error('Failed to fetch running routes:', error);
      if (error instanceof Error) {
        return res.status(500).json({
          error: 'Failed to fetch routes',
          message: error.message,
        });
      }
      next(error);
    }
  }

  async getRouteById(req: Request, res: Response, next: NextFunction) {
    try {
      const { routeId } = req.params;
      const route = await this.runningService.getRouteById(routeId);

      if (!route) {
        return res.status(404).json({
          error: 'Route not found',
          message: 'The requested running route does not exist',
        });
      }

      res.status(200).json({
        message: 'Running route fetched successfully',
        data: { route },
      });
    } catch (error) {
      logger.error('Failed to fetch running route:', error);
      if (error instanceof Error) {
        return res.status(500).json({
          error: 'Failed to fetch route',
          message: error.message,
        });
      }
      next(error);
    }
  }

  async getWeather(req: Request, res: Response, next: NextFunction) {
    try {
      const weather = await this.runningService.getWeatherForRunning();

      res.status(200).json({
        message: 'Weather data fetched successfully',
        data: { weather },
      });
    } catch (error) {
      logger.error('Failed to fetch weather data:', error);
      if (error instanceof Error) {
        return res.status(500).json({
          error: 'Failed to fetch weather',
          message: error.message,
        });
      }
      next(error);
    }
  }

  async startSession(req: Request<unknown, unknown, CreateRunningSessionRequest>, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const session = await this.runningService.startRunningSession(user._id.toString(), req.body);

      res.status(201).json({
        message: 'Running session started successfully',
        data: { session },
      });
    } catch (error) {
      logger.error('Failed to start running session:', error);
      if (error instanceof Error) {
        return res.status(500).json({
          error: 'Failed to start session',
          message: error.message,
        });
      }
      next(error);
    }
  }

  async completeSession(req: Request<unknown, unknown, CompleteRunningSessionRequest>, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const session = await this.runningService.completeRunningSession(user._id.toString(), req.body);

      res.status(200).json({
        message: 'Running session completed successfully',
        data: { session },
      });
    } catch (error) {
      logger.error('Failed to complete running session:', error);
      if (error instanceof Error) {
        return res.status(500).json({
          error: 'Failed to complete session',
          message: error.message,
        });
      }
      next(error);
    }
  }

  async getUserSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const limit = parseInt(req.query.limit as string) || 10;
      const sessions = await this.runningService.getUserSessions(user._id.toString(), limit);

      res.status(200).json({
        message: 'User running sessions fetched successfully',
        data: { sessions },
      });
    } catch (error) {
      logger.error('Failed to fetch user sessions:', error);
      if (error instanceof Error) {
        return res.status(500).json({
          error: 'Failed to fetch sessions',
          message: error.message,
        });
      }
      next(error);
    }
  }

  async getUserAchievements(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const achievements = await this.runningService.getUserAchievements(user._id.toString());

      res.status(200).json({
        message: 'User achievements fetched successfully',
        data: { achievements },
      });
    } catch (error) {
      logger.error('Failed to fetch user achievements:', error);
      if (error instanceof Error) {
        return res.status(500).json({
          error: 'Failed to fetch achievements',
          message: error.message,
        });
      }
      next(error);
    }
  }
}
