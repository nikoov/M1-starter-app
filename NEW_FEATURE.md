# M1

## New Feature

**Name:** UBC Campus Running App with Weather Integration

**Short description:** Added a comprehensive running feature specifically designed for UBC Vancouver campus. Users can explore 5 pre-mapped running routes around campus, track their runs with GPS, view real-time weather conditions, and earn achievements. The feature integrates OpenWeatherMap API for weather data and includes gamification elements like campus-specific achievements and leaderboards.

**Location and code:** 
- Backend: 
  - `backend/src/running.types.ts` - TypeScript interfaces for running data
  - `backend/src/running.model.ts` - Mongoose schemas for routes, sessions, achievements
  - `backend/src/campus-routes.ts` - UBC-specific running routes and landmarks
  - `backend/src/weather.service.ts` - OpenWeatherMap API integration
  - `backend/src/running.service.ts` - Core running logic and GPS calculations
  - `backend/src/running.controller.ts` - API endpoints controller
  - `backend/src/running.routes.ts` - Express routes for running API
  - `backend/src/routes.ts` - Added running routes to main router
  - `backend/package.json` - Added axios dependency
- Frontend: 
  - `frontend/app/src/main/java/com/cpen321/usermanagement/ui/screens/RunningScreen.kt` - Main running interface
  - `frontend/app/src/main/java/com/cpen321/usermanagement/ui/screens/RouteSelectionScreen.kt` - Route selection
  - `frontend/app/src/main/java/com/cpen321/usermanagement/ui/screens/RunTrackingScreen.kt` - GPS tracking
  - `frontend/app/src/main/java/com/cpen321/usermanagement/ui/screens/AchievementScreen.kt` - Achievements display
  - `frontend/app/src/main/java/com/cpen321/usermanagement/data/remote/api/RunningInterface.kt` - API interface
  - `frontend/app/src/main/java/com/cpen321/usermanagement/data/remote/dto/RunningModels.kt` - Data models
- External API: OpenWeatherMap API (https://openweathermap.org/api)

**Key Features:**
1. **UBC Campus Routes**: 5 pre-mapped routes including Rose Garden Loop, Main Mall Circuit, Pacific Spirit Park Trail, Beach Route, and Stadium Circuit
2. **Real-time Weather**: Weather conditions and running recommendations via OpenWeatherMap API
3. **GPS Tracking**: Live run tracking with distance calculation using Haversine formula
4. **Achievement System**: Campus-specific achievements (Distance Master, Speed Demon, Rain Runner, etc.)
5. **Session Management**: Start/complete run sessions with detailed statistics
6. **Campus Landmarks**: Integration with UBC landmarks and points of interest
7. **Weather-based Recommendations**: Smart suggestions based on current weather conditions

**Technical Implementation:**
- **Backend API Endpoints**:
  - `GET /api/running/routes` - Get all campus running routes with weather
  - `GET /api/running/routes/:id` - Get specific route details
  - `GET /api/running/weather` - Get current weather for UBC
  - `POST /api/running/sessions/start` - Start a running session
  - `POST /api/running/sessions/complete` - Complete session with GPS data
  - `GET /api/running/sessions` - Get user's running history
  - `GET /api/running/achievements` - Get user achievements
- **External API Integration**: OpenWeatherMap for real-time weather data
- **GPS Calculations**: Haversine distance formula for accurate distance tracking
- **Achievement System**: Automatic achievement unlocking based on running statistics
- **Weather Intelligence**: Smart running recommendations based on temperature, humidity, wind, and conditions
- **Campus-specific Design**: Routes and landmarks specifically designed for UBC Vancouver campus

**Creative Elements:**
- **Location-specific**: Designed exclusively for UBC Vancouver campus
- **Educational**: Learn about campus landmarks while running
- **Gamification**: Achievement system encourages continued engagement
- **Weather Integration**: Smart recommendations make running safer and more enjoyable
- **Social Features**: Potential for leaderboards and sharing achievements
- **Practical Value**: Actually useful for UBC students and staff
