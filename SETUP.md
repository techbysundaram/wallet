# Quick Start Guide

This guide will help you set up and run the Wallet Expense Tracking application.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** package manager
- **Git** for version control
- **Expo Go** app on your mobile device (iOS or Android) for testing

## Step 1: Clone the Repository

```bash
git clone https://github.com/techbysundaram/wallet.git
cd wallet
```

## Step 2: Set Up the Database

1. **Create a PostgreSQL database:**
   ```bash
   createdb wallet_db
   ```

2. **Run the database schema:**
   ```bash
   psql -d wallet_db -f backend/src/db/schema.sql
   ```

   This will create all necessary tables:
   - users
   - wallets
   - categories
   - transactions
   - default_categories

## Step 3: Set Up the Backend

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment configuration:**
   ```bash
   cp .env.example .env
   ```

4. **Edit the `.env` file with your settings:**
   ```env
   PORT=3000
   NODE_ENV=development
   
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_postgres_username
   DB_PASSWORD=your_postgres_password
   DB_NAME=wallet_db
   
   # JWT Secret (use a strong random string in production)
   JWT_SECRET=your-super-secret-jwt-key-change-this
   ```

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

   The API should now be running at `http://localhost:3000`

   You should see:
   ```
   Server is running on port 3000
   Environment: development
   Connected to PostgreSQL database
   ```

## Step 4: Set Up the Frontend

1. **Open a new terminal and navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Update API configuration (if needed):**
   
   If your backend is running on a different host/port, edit `src/services/api.js`:
   ```javascript
   const API_URL = 'http://YOUR_IP_ADDRESS:3000/api';
   ```
   
   **Important**: If testing on a physical device, use your computer's local IP address instead of `localhost`.

4. **Start the Expo development server:**
   ```bash
   npm start
   ```

## Step 5: Run the App

After starting Expo, you'll see a QR code in the terminal.

### Option 1: Mobile Device (Recommended)
1. Install the **Expo Go** app on your phone:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code:
   - **iOS**: Use the Camera app
   - **Android**: Use the Expo Go app

### Option 2: Emulator/Simulator
- Press `a` for Android emulator
- Press `i` for iOS simulator (macOS only)

### Option 3: Web Browser
- Press `w` to run in web browser

## Testing the Application

### 1. Register a New User
- Open the app and click "Register"
- Enter your details:
  - Username (min 3 characters)
  - Email
  - Password (min 6 characters)

### 2. Automatic Setup
Upon registration, the app automatically:
- Creates a default wallet named "My Wallet"
- Populates default categories (Food, Transportation, etc.)

### 3. Add a Transaction
- From the home screen, tap "Income" or "Expense"
- Fill in the details:
  - Select wallet
  - Select category
  - Enter amount
  - Add description (optional)
  - Set date
- Tap "Add Income" or "Add Expense"

### 4. View Transactions
- Navigate to the "Transactions" tab to see all your transactions
- Pull down to refresh

### 5. Check Profile
- Navigate to the "Profile" tab
- View your account details
- Access wallet and category management

## Common Issues and Solutions

### Backend Issues

**Issue**: Cannot connect to database
```
Error: connect ECONNREFUSED
```
**Solution**: 
- Ensure PostgreSQL is running: `pg_ctl status`
- Check database credentials in `.env`
- Verify database exists: `psql -l`

**Issue**: Port already in use
```
Error: listen EADDRINUSE :::3000
```
**Solution**: 
- Change PORT in `.env` to a different port (e.g., 3001)
- Or kill the process using port 3000:
  ```bash
  lsof -ti:3000 | xargs kill
  ```

### Frontend Issues

**Issue**: Cannot connect to backend from mobile device
**Solution**: 
- Make sure your phone and computer are on the same WiFi network
- Use your computer's local IP instead of `localhost` in `src/services/api.js`
- On Mac: `ifconfig | grep "inet "` (look for 192.168.x.x)
- On Windows: `ipconfig` (look for IPv4 Address)

**Issue**: Expo Metro bundler errors
**Solution**: 
```bash
# Clear cache and restart
npm start -- --clear
```

## API Testing with cURL

You can test the API endpoints directly:

### Register a user:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the returned token and use it for authenticated requests:

### Get wallets:
```bash
curl http://localhost:3000/api/wallets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Development Tips

1. **Backend Auto-reload**: The backend uses nodemon for automatic reloading on file changes

2. **Database Queries**: You can inspect the database directly:
   ```bash
   psql wallet_db
   \dt                    # List tables
   SELECT * FROM users;   # View users
   ```

3. **Reset Database**: To start fresh:
   ```bash
   dropdb wallet_db
   createdb wallet_db
   psql -d wallet_db -f backend/src/db/schema.sql
   ```

## Next Steps

- Explore the API documentation in the README
- Customize categories and wallets
- Add expense tracking for your real expenses
- Check the SECURITY.md file for security best practices

## Getting Help

If you encounter issues:
1. Check the console output for error messages
2. Review the logs in both backend and frontend terminals
3. Ensure all dependencies are installed correctly
4. Verify database connection and schema

## Production Deployment

For production deployment:
1. Set `NODE_ENV=production` in backend `.env`
2. Use strong JWT_SECRET
3. Set up proper PostgreSQL user permissions
4. Enable HTTPS
5. Configure CORS for specific domains
6. Build the React Native app using Expo's build service

Happy expense tracking! 🎉
