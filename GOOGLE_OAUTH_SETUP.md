# Google OAuth Setup Instructions

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name your project (e.g., "Finance Tracker")
4. Click "Create"

## Step 2: Enable Google+ API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

## Step 3: Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - Select "External"
   - Fill in app name: "Finance Tracker"
   - Add your email as support email
   - Add authorized domain (for development, skip this)
   - Click "Save and Continue"
   - Skip scopes by clicking "Save and Continue"
   - Add test users (your email) if in testing mode
   - Click "Save and Continue"

## Step 4: Configure OAuth Client

1. Select "Web application" as application type
2. Name it (e.g., "Finance Tracker Web")
3. Add Authorized JavaScript origins:
   ```
   http://localhost:5000
   http://localhost:8080
   ```
4. Add Authorized redirect URIs:
   ```
   http://localhost:5000/api/auth/google/callback
   ```
5. Click "Create"
6. **Copy the Client ID and Client Secret**

## Step 5: Update Backend .env File

1. Open `Backend/.env` file (create if doesn't exist)
2. Add your credentials:
   ```env
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   FRONTEND_URL=http://localhost:8080
   ```

## Step 6: Test OAuth

1. Restart your backend server
2. Open http://localhost:8080
3. Click "Continue with Google" button
4. Select your Google account
5. Grant permissions
6. You should be redirected back and logged in!

## Troubleshooting

### "Error: redirect_uri_mismatch"
- Make sure the redirect URI in Google Console matches exactly: `http://localhost:5000/api/auth/google/callback`
- No trailing slashes
- Check for http vs https

### "Access blocked: This app's request is invalid"
- Make sure you've configured the OAuth consent screen
- Add yourself as a test user

### Backend shows "Google OAuth not configured"
- Check that GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are in .env
- Restart the backend server after adding credentials

## Production Setup

For production:
1. Update authorized origins and redirect URIs with your production URLs
2. Use environment variables on your hosting platform
3. Complete OAuth consent screen verification
4. Move app from "Testing" to "Published" status in Google Console
