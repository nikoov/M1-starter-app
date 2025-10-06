package com.cpen321.usermanagement.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.cpen321.usermanagement.R
import com.cpen321.usermanagement.data.remote.dto.RunningRoute
import com.cpen321.usermanagement.data.remote.dto.WeatherCondition
import com.cpen321.usermanagement.ui.components.MessageSnackbar
import com.cpen321.usermanagement.ui.components.MessageSnackbarState
import com.cpen321.usermanagement.ui.theme.LocalSpacing
import com.cpen321.usermanagement.ui.viewmodels.RunningViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RunningScreen(
    runningViewModel: RunningViewModel,
    onRouteClick: (String) -> Unit,
    onAchievementsClick: () -> Unit
) {
    val uiState by runningViewModel.uiState.collectAsState()
    val snackBarHostState = remember { SnackbarHostState() }

    LaunchedEffect(Unit) {
        runningViewModel.loadRoutes()
    }

    Scaffold(
        topBar = {
            RunningTopBar(
                onAchievementsClick = onAchievementsClick
            )
        },
        snackbarHost = {
            MessageSnackbar(
                hostState = snackBarHostState,
                messageState = MessageSnackbarState(
                    successMessage = uiState.successMessage,
                    errorMessage = uiState.errorMessage,
                    onSuccessMessageShown = runningViewModel::clearSuccessMessage,
                    onErrorMessageShown = runningViewModel::clearError
                )
            )
        }
    ) { paddingValues ->
        RunningContent(
            paddingValues = paddingValues,
            uiState = uiState,
            onRouteClick = onRouteClick,
            onRefresh = { runningViewModel.loadRoutes() }
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun RunningTopBar(
    onAchievementsClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    TopAppBar(
        modifier = modifier,
        title = {
            Text(
                text = "UBC Running",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Medium
            )
        },
        actions = {
            TextButton(onClick = onAchievementsClick) {
                Text("Achievements")
            }
        },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = MaterialTheme.colorScheme.surface,
            titleContentColor = MaterialTheme.colorScheme.onSurface
        )
    )
}

@Composable
private fun RunningContent(
    paddingValues: PaddingValues,
    uiState: RunningUiState,
    onRouteClick: (String) -> Unit,
    onRefresh: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(paddingValues)
            .padding(16.dp)
    ) {
        // Weather Card
        if (uiState.weather != null) {
            WeatherCard(
                weather = uiState.weather,
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(16.dp))
        }

        // Routes Section
        Text(
            text = "Campus Routes",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(8.dp))

        when {
            uiState.isLoading -> {
                Box(
                    modifier = Modifier.fillMaxWidth(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            }
            uiState.routes.isNotEmpty() -> {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(uiState.routes) { route ->
                        RouteCard(
                            route = route,
                            onClick = { onRouteClick(route.id) }
                        )
                    }
                }
            }
            else -> {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.surfaceVariant
                    )
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "No routes available",
                            style = MaterialTheme.typography.bodyLarge
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Button(onClick = onRefresh) {
                            Text("Retry")
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun WeatherCard(
    weather: WeatherCondition,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(
            containerColor = if (weather.isGoodForRunning) {
                MaterialTheme.colorScheme.primaryContainer
            } else {
                MaterialTheme.colorScheme.errorContainer
            }
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Current Weather",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "${weather.temperature}°C - ${weather.description}",
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
                Text(
                    text = weather.icon,
                    style = MaterialTheme.typography.headlineMedium
                )
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = if (weather.isGoodForRunning) {
                    "✅ Great weather for running!"
                } else {
                    "⚠️ Check recommendations below"
                },
                style = MaterialTheme.typography.bodySmall,
                color = if (weather.isGoodForRunning) {
                    MaterialTheme.colorScheme.onPrimaryContainer
                } else {
                    MaterialTheme.colorScheme.onErrorContainer
                }
            )
            
            if (weather.recommendations.isNotEmpty()) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Recommendations:",
                    style = MaterialTheme.typography.bodySmall,
                    fontWeight = FontWeight.Bold
                )
                weather.recommendations.forEach { recommendation ->
                    Text(
                        text = "• $recommendation",
                        style = MaterialTheme.typography.bodySmall
                    )
                }
            }
        }
    }
}

@Composable
private fun RouteCard(
    route: RunningRoute,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        onClick = onClick,
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column(
                    modifier = Modifier.weight(1f)
                ) {
                    Text(
                        text = route.name,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = route.description,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                
                Surface(
                    shape = MaterialTheme.shapes.small,
                    color = when (route.difficulty) {
                        "Easy" -> MaterialTheme.colorScheme.primaryContainer
                        "Medium" -> MaterialTheme.colorScheme.secondaryContainer
                        "Hard" -> MaterialTheme.colorScheme.errorContainer
                        else -> MaterialTheme.colorScheme.surfaceVariant
                    }
                ) {
                    Text(
                        text = route.difficulty,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "${route.distance} km",
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Medium
                )
                Text(
                    text = "${route.estimatedTime} min",
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Medium
                )
            }
            
            if (route.landmarks.isNotEmpty()) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Landmarks: ${route.landmarks.joinToString(", ")}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

// UI State for Running Screen
data class RunningUiState(
    val isLoading: Boolean = false,
    val routes: List<RunningRoute> = emptyList(),
    val weather: WeatherCondition? = null,
    val successMessage: String? = null,
    val errorMessage: String? = null
)
