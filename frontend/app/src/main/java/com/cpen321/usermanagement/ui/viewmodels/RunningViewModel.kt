package com.cpen321.usermanagement.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.cpen321.usermanagement.data.remote.api.RetrofitClient
import com.cpen321.usermanagement.data.remote.dto.*
import com.cpen321.usermanagement.ui.screens.RunningUiState
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class RunningViewModel @Inject constructor() : ViewModel() {
    
    private val _uiState = MutableStateFlow(RunningUiState())
    val uiState: StateFlow<RunningUiState> = _uiState.asStateFlow()
    
    private val runningInterface = RetrofitClient.runningInterface
    
    fun loadRoutes() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
            
            try {
                val response = runningInterface.getAllRoutes()
                if (response.isSuccessful && response.body() != null) {
                    val data = response.body()!!.data
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        routes = data.routes,
                        weather = data.weather,
                        successMessage = response.body()!!.message
                    )
                } else {
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        errorMessage = "Failed to load routes: ${response.message()}"
                    )
                }
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = "Network error: ${e.message}"
                )
            }
        }
    }
    
    fun loadWeather() {
        viewModelScope.launch {
            try {
                val response = runningInterface.getWeather()
                if (response.isSuccessful && response.body() != null) {
                    val weather = response.body()!!.data.weather
                    _uiState.value = _uiState.value.copy(
                        weather = weather,
                        successMessage = response.body()!!.message
                    )
                } else {
                    _uiState.value = _uiState.value.copy(
                        errorMessage = "Failed to load weather: ${response.message()}"
                    )
                }
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    errorMessage = "Weather error: ${e.message}"
                )
            }
        }
    }
    
    fun startSession(routeId: String, onSuccess: (RunningSession) -> Unit) {
        viewModelScope.launch {
            try {
                val request = StartSessionRequest(
                    routeId = routeId,
                    startTime = java.time.Instant.now().toString()
                )
                val response = runningInterface.startSession(request)
                if (response.isSuccessful && response.body() != null) {
                    val session = response.body()!!.data.session
                    _uiState.value = _uiState.value.copy(
                        successMessage = response.body()!!.message
                    )
                    onSuccess(session)
                } else {
                    _uiState.value = _uiState.value.copy(
                        errorMessage = "Failed to start session: ${response.message()}"
                    )
                }
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    errorMessage = "Session error: ${e.message}"
                )
            }
        }
    }
    
    fun completeSession(
        sessionId: String,
        gpsData: List<GpsPoint>,
        onSuccess: (RunningSession) -> Unit
    ) {
        viewModelScope.launch {
            try {
                val request = CompleteSessionRequest(
                    sessionId = sessionId,
                    endTime = java.time.Instant.now().toString(),
                    gpsData = gpsData
                )
                val response = runningInterface.completeSession(request)
                if (response.isSuccessful && response.body() != null) {
                    val session = response.body()!!.data.session
                    _uiState.value = _uiState.value.copy(
                        successMessage = response.body()!!.message
                    )
                    onSuccess(session)
                } else {
                    _uiState.value = _uiState.value.copy(
                        errorMessage = "Failed to complete session: ${response.message()}"
                    )
                }
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    errorMessage = "Completion error: ${e.message}"
                )
            }
        }
    }
    
    fun loadUserSessions() {
        viewModelScope.launch {
            try {
                val response = runningInterface.getUserSessions(limit = 10)
                if (response.isSuccessful && response.body() != null) {
                    val sessions = response.body()!!.data.sessions
                    _uiState.value = _uiState.value.copy(
                        successMessage = response.body()!!.message
                    )
                    // Handle sessions data as needed
                } else {
                    _uiState.value = _uiState.value.copy(
                        errorMessage = "Failed to load sessions: ${response.message()}"
                    )
                }
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    errorMessage = "Sessions error: ${e.message}"
                )
            }
        }
    }
    
    fun loadAchievements() {
        viewModelScope.launch {
            try {
                val response = runningInterface.getUserAchievements()
                if (response.isSuccessful && response.body() != null) {
                    val achievements = response.body()!!.data.achievements
                    _uiState.value = _uiState.value.copy(
                        successMessage = response.body()!!.message
                    )
                    // Handle achievements data as needed
                } else {
                    _uiState.value = _uiState.value.copy(
                        errorMessage = "Failed to load achievements: ${response.message()}"
                    )
                }
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    errorMessage = "Achievements error: ${e.message}"
                )
            }
        }
    }
    
    fun clearSuccessMessage() {
        _uiState.value = _uiState.value.copy(successMessage = null)
    }
    
    fun clearError() {
        _uiState.value = _uiState.value.copy(errorMessage = null)
    }
}
