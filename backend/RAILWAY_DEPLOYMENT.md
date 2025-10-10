# Railway Deployment Configuration

## Quick Deploy to Railway

1. **Sign up at [Railway.app](https://railway.app)** (free tier available)
2. **Connect your GitHub account**
3. **Create a new project** and connect this repository
4. **Set environment variables** in Railway dashboard:
   - `PORT` = 3000 (Railway will set this automatically)
   - `JWT_SECRET` = your_long_random_string_here
   - `GOOGLE_CLIENT_ID` = your_google_web_client_id
   - `MONGODB_URI` = mongodb+srv://user:password@cluster.mongodb.net/dbname

## Alternative: Deploy with Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy from backend directory
cd backend
railway deploy
```

## Environment Variables Required

- `PORT`: Server port (Railway sets this automatically)
- `JWT_SECRET`: Long random string for JWT signing
- `GOOGLE_CLIENT_ID`: Google OAuth web client ID
- `MONGODB_URI`: MongoDB connection string

## Database Setup

For MongoDB, you can use:
- **MongoDB Atlas** (free tier): https://www.mongodb.com/atlas
- **Railway MongoDB** addon (if available)

## Testing Deployment

Once deployed, test the endpoints:
- `GET /api/auth/health` - Health check
- `POST /api/auth/signin` - Google Sign-In
- `POST /api/auth/signup` - User registration
