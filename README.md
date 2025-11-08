# Wallet Expense Tracking App

A full-stack expense tracking application built with React Native, Express.js, and PostgreSQL.

## Features

- **User Authentication**: Secure registration and login
- **Wallet Management**: Create and manage multiple wallets
- **Expense Tracking**: Track income and expenses
- **Categories**: Organize transactions with customizable categories
- **Transaction History**: View and filter all transactions
- **Dashboard**: Overview of total balance and recent activity

## Tech Stack

### Backend
- **Express.js**: REST API server
- **PostgreSQL**: Database for storing users, wallets, categories, and transactions
- **JWT**: Token-based authentication
- **bcryptjs**: Password hashing
- **express-validator**: Input validation

### Frontend
- **React Native**: Mobile application framework
- **Expo**: Development platform
- **React Navigation**: Navigation library
- **Axios**: HTTP client
- **AsyncStorage**: Local storage for auth tokens

## Project Structure

```
wallet/
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth middleware
│   │   ├── models/         # Data models
│   │   ├── routes/         # API routes
│   │   ├── db/            # Database schema
│   │   └── server.js      # Main server file
│   ├── .env.example       # Environment variables template
│   └── package.json
│
└── frontend/               # React Native frontend
    ├── src/
    │   ├── screens/       # App screens
    │   ├── navigation/    # Navigation configuration
    │   ├── services/      # API services
    │   ├── context/       # React context (Auth)
    │   └── components/    # Reusable components
    ├── App.js
    └── package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn
- Expo CLI (for frontend development)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a PostgreSQL database:
   ```bash
   createdb wallet_db
   ```

4. Set up the database schema:
   ```bash
   psql -d wallet_db -f src/db/schema.sql
   ```

5. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

6. Update the `.env` file with your database credentials:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=wallet_db
   JWT_SECRET=your_secret_key
   ```

7. Start the server:
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the API URL in `src/services/api.js` if your backend is running on a different host/port

4. Start the Expo development server:
   ```bash
   npm start
   ```

5. Run on your device:
   - **iOS**: Press `i` in the terminal or scan the QR code with the Expo Go app
   - **Android**: Press `a` in the terminal or scan the QR code with the Expo Go app
   - **Web**: Press `w` in the terminal

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Wallets
- `GET /api/wallets` - Get all wallets
- `POST /api/wallets` - Create a new wallet
- `GET /api/wallets/:id` - Get wallet by ID
- `PUT /api/wallets/:id` - Update wallet
- `DELETE /api/wallets/:id` - Delete wallet

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category
- `GET /api/categories/:id` - Get category by ID
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create a new transaction
- `GET /api/transactions/:id` - Get transaction by ID
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/summary` - Get transaction summary
- `GET /api/transactions/breakdown` - Get category breakdown

## Database Schema

### Users
- id, username, email, password_hash, created_at, updated_at

### Wallets
- id, user_id, name, balance, currency, created_at, updated_at

### Categories
- id, user_id, name, type (income/expense), color, icon, created_at

### Transactions
- id, user_id, wallet_id, category_id, amount, type, description, transaction_date, created_at, updated_at

## Development

### Backend Development
```bash
cd backend
npm run dev  # Starts server with nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm start    # Starts Expo development server
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Author

Built with ❤️ for expense tracking