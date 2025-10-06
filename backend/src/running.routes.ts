import { Router } from 'express';
import { z } from 'zod';
import { RunningController } from './running.controller';
import { CompleteRunningSessionRequest, CreateRunningSessionRequest } from './running.types';
import { validateBody } from './validation.middleware';

const router = Router();
const runningController = new RunningController();

// Validation schemas
const createSessionSchema = z.object({
  routeId: z.string().min(1, 'Route ID is required'),
  startTime: z.string().datetime('Invalid start time format').transform(str => new Date(str)),
});

const completeSessionSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  endTime: z.string().datetime('Invalid end time format').transform(str => new Date(str)),
  gpsData: z.array(z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    timestamp: z.string().datetime('Invalid timestamp format').transform(str => new Date(str)),
  })).min(1, 'GPS data is required'),
});

// Routes
router.get('/routes', runningController.getAllRoutes.bind(runningController));
router.get('/routes/:routeId', runningController.getRouteById.bind(runningController));
router.get('/weather', runningController.getWeather.bind(runningController));

router.post(
  '/sessions/start',
  validateBody<CreateRunningSessionRequest>(createSessionSchema),
  runningController.startSession.bind(runningController)
);

router.post(
  '/sessions/complete',
  validateBody<CompleteRunningSessionRequest>(completeSessionSchema),
  runningController.completeSession.bind(runningController)
);

router.get('/sessions', runningController.getUserSessions.bind(runningController));
router.get('/achievements', runningController.getUserAchievements.bind(runningController));

export default router;
