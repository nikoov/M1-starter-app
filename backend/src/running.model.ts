import { Schema } from 'mongoose';
import { IRunningAchievement, IRunningRoute, IRunningSession } from './running.types';

// Running Route Schema
const runningRouteSchema = new Schema<IRunningRoute>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  distance: {
    type: Number,
    required: true,
    min: 0.1,
    max: 50,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  landmarks: [{
    type: String,
    trim: true,
  }],
  coordinates: {
    start: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    waypoints: [{
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      name: { type: String, required: true },
    }],
    end: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  },
  estimatedTime: {
    type: Number,
    required: true,
    min: 1,
  },
  weatherDependent: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Running Session Schema
const runningSessionSchema = new Schema<IRunningSession>({
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  routeId: {
    type: String,
    required: true,
    ref: 'RunningRoute',
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
  },
  distance: {
    type: Number,
    min: 0,
  },
  duration: {
    type: Number,
    min: 0,
  },
  averagePace: {
    type: Number,
    min: 0,
  },
  calories: {
    type: Number,
    min: 0,
  },
  weather: {
    temperature: Number,
    condition: String,
    humidity: Number,
  },
  gpsData: [{
    lat: Number,
    lng: Number,
    timestamp: Date,
  }],
  completed: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Running Achievement Schema
const runningAchievementSchema = new Schema<IRunningAchievement>({
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  type: {
    type: String,
    enum: ['distance', 'streak', 'route', 'weather', 'speed'],
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  icon: {
    type: String,
    required: true,
  },
  unlockedAt: {
    type: Date,
    required: true,
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

export { runningAchievementSchema, runningRouteSchema, runningSessionSchema };

