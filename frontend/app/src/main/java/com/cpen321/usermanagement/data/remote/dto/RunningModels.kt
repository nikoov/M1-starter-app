package com.cpen321.usermanagement.data.remote.dto

import com.google.gson.annotations.SerializedName

// Running Route Models
data class RunningRoute(
    @SerializedName("_id") val id: String,
    val name: String,
    val description: String,
    val distance: Double,
    val difficulty: String,
    val landmarks: List<String>,
    val coordinates: RouteCoordinates,
    val estimatedTime: Int,
    val weatherDependent: Boolean
)

data class RouteCoordinates(
    val start: Coordinate,
    val waypoints: List<Waypoint>,
    val end: Coordinate
)

data class Coordinate(
    val lat: Double,
    val lng: Double
)

data class Waypoint(
    val lat: Double,
    val lng: Double,
    val name: String
)

// Weather Models
data class WeatherCondition(
    val temperature: Int,
    val condition: String,
    val humidity: Int,
    val windSpeed: Double,
    val description: String,
    val icon: String,
    val isGoodForRunning: Boolean,
    val recommendations: List<String>
)

// Running Session Models
data class RunningSession(
    @SerializedName("_id") val id: String,
    val userId: String,
    val routeId: String,
    val startTime: String,
    val endTime: String?,
    val distance: Double,
    val duration: Int,
    val averagePace: Double,
    val calories: Int,
    val weather: SessionWeather,
    val gpsData: List<GpsPoint>,
    val completed: Boolean
)

data class SessionWeather(
    val temperature: Int,
    val condition: String,
    val humidity: Int
)

data class GpsPoint(
    val lat: Double,
    val lng: Double,
    val timestamp: String
)

// Achievement Models
data class RunningAchievement(
    @SerializedName("_id") val id: String,
    val userId: String,
    val type: String,
    val title: String,
    val description: String,
    val icon: String,
    val unlockedAt: String,
    val metadata: Map<String, Any>
)

// Request Models
data class StartSessionRequest(
    val routeId: String,
    val startTime: String
)

data class CompleteSessionRequest(
    val sessionId: String,
    val endTime: String,
    val gpsData: List<GpsPoint>
)

// Response Models
data class RoutesResponse(
    val message: String,
    val data: RoutesData
)

data class RoutesData(
    val routes: List<RunningRoute>,
    val weather: WeatherCondition,
    val recommendations: List<String>
)

data class WeatherResponse(
    val message: String,
    val data: WeatherData
)

data class WeatherData(
    val weather: WeatherCondition
)

data class SessionResponse(
    val message: String,
    val data: SessionData
)

data class SessionData(
    val session: RunningSession
)

data class SessionsResponse(
    val message: String,
    val data: SessionsData
)

data class SessionsData(
    val sessions: List<RunningSession>
)

data class AchievementsResponse(
    val message: String,
    val data: AchievementsData
)

data class AchievementsData(
    val achievements: List<RunningAchievement>
)
