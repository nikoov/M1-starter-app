package com.cpen321.usermanagement.data.remote.api

import com.cpen321.usermanagement.data.remote.dto.*
import retrofit2.Response
import retrofit2.http.*

interface RunningInterface {
    @GET("running/routes")
    suspend fun getAllRoutes(): Response<RoutesResponse>

    @GET("running/routes/{routeId}")
    suspend fun getRouteById(@Path("routeId") routeId: String): Response<SessionResponse>

    @GET("running/weather")
    suspend fun getWeather(): Response<WeatherResponse>

    @POST("running/sessions/start")
    suspend fun startSession(@Body request: StartSessionRequest): Response<SessionResponse>

    @POST("running/sessions/complete")
    suspend fun completeSession(@Body request: CompleteSessionRequest): Response<SessionResponse>

    @GET("running/sessions")
    suspend fun getUserSessions(@Query("limit") limit: Int = 10): Response<SessionsResponse>

    @GET("running/achievements")
    suspend fun getUserAchievements(): Response<AchievementsResponse>
}
