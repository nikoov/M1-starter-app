# M1

## Deployment info

The public IP of your back-end server: [TO_BE_DEPLOYED]

Domain name (if any): [TO_BE_DEPLOYED]

## Deployment Instructions

### Backend Deployment (Render)

1. **Create Render Account**: Sign up at https://render.com
2. **Create New Web Service**: 
   - Connect your GitHub repository
   - Root Directory: `/backend`
   - Build Command: `npm ci && npm run build`
   - Start Command: `node dist/index.js`
   - Node Version: 20
3. **Environment Variables**:
   - `PORT`: 3000
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `GOOGLE_CLIENT_ID`: Your Google OAuth Web Client ID
   - `JWT_SECRET`: A long random string
   - `OPENWEATHER_API_KEY`: Your OpenWeatherMap API key
4. **Deploy**: Click "Deploy" and wait for deployment to complete

### Frontend Deployment (Android APK)

1. **Build Debug APK**:
   ```bash
   cd frontend
   ./gradlew assembleDebug
   ```
   - APK location: `frontend/app/build/outputs/apk/debug/app-debug.apk`

2. **Build Release APK**:
   ```bash
   cd frontend
   ./gradlew assembleRelease
   ```
   - APK location: `frontend/app/build/outputs/apk/release/app-release.apk`

3. **Test on Emulator**:
   - Create Pixel 7 AVD with Android API 33
   - Install APK: `adb install app-debug.apk`
   - Test all features including running app

### Environment Setup

#### Backend (.env)
```
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
JWT_SECRET=your_long_random_string
OPENWEATHER_API_KEY=your_openweather_api_key
```

#### Frontend (local.properties)
```
sdk.dir=/Users/nikoo/Library/Android/sdk
API_BASE_URL=https://your-render-app.onrender.com/api/
IMAGE_BASE_URL=https://your-render-app.onrender.com/
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### API Endpoints

- **Auth**: `/api/auth/signup`, `/api/auth/signin`
- **User**: `/api/user/profile` (GET, POST, DELETE)
- **Hobbies**: `/api/hobbies` (GET)
- **Media**: `/api/media/upload` (POST)
- **Running**: 
  - `/api/running/routes` (GET)
  - `/api/running/weather` (GET)
  - `/api/running/sessions/start` (POST)
  - `/api/running/sessions/complete` (POST)
  - `/api/running/sessions` (GET)
  - `/api/running/achievements` (GET)

### External APIs Used

1. **OpenWeatherMap API**: Weather data for UBC campus
   - Endpoint: `https://api.openweathermap.org/data/2.5/weather`
   - Used for: Running weather conditions and recommendations

2. **Google OAuth**: User authentication
   - Used for: User sign-in/sign-up

### Deployment Status

- ✅ Backend code ready for deployment
- ✅ Docker configuration complete
- ✅ Environment variables documented
- ⏳ Frontend running screens (in progress)
- ⏳ Cloud deployment (pending)
