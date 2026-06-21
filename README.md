# 🪙 Premium Expense Tracker

An elegant, feature-rich, full-stack Expense Tracker designed with modern web aesthetics and an interactive interface. It allows users to track income and expenses, visualize financial data through responsive charts, manage budgets, execute commands via a command palette, listen to interactive audio cues, view activity with a GitHub-style contribution calendar, and debug via a built-in terminal console shell.

---

## 📸 Screenshots & Previews

### 📊 Dashboard Overview
![Dashboard Screenshot](./screenshots/dashboard.png)

### 🔑 Authentication Flow
| Login Screen | Sign Up Screen | OTP Verification |
|---|---|---|
| ![Login](./screenshots/login.png) | ![Sign Up](./screenshots/signup.png) | ![OTP Verification](./screenshots/otp.png) |

---

## ✨ Features

- **📊 Comprehensive Financial Analytics**: Interactive line, bar, and pie charts (using Recharts) to visualize expense distribution and income-to-expense ratios over the last 30 days.
- **🌓 Dynamic Dark/Light Theme**: Fully responsive dark mode toggle integrated via React Context API to match user preferences.
- **⌨️ Command Palette**: Press `Ctrl + K` (or click the search button) to open an interactive command palette for quick navigation, search, and action execution.
- **📅 Activity Contribution Calendar**: A GitHub-style activity grid mapping financial transactions (income/expense entries) over time to visualize financial tracking consistency.
- **⚙️ Diagnostics & Analytics**: A detailed diagnostics dashboard displaying app health, memory usage, transaction metrics, and API latency checks.
- **🐚 Built-in Developer Console Shell**: A retro-style terminal window emulator allowing developers/users to run interactive console diagnostics commands.
- **🎛️ Interactive Sliding Drawer**: Sleek slide-out sidebar drawer for adding income or expenses seamlessly.
- **🎵 Audio Feedback & Sound Cues**: Micro-interaction sound effects that play on successful actions, error states, and logins to elevate the user experience.
- **🔒 Secure Authentication Flow**: 
  - Token-based JWT authentication with authorization headers.
  - Multi-step Sign Up with automated OTP verification.
  - Fully featured Password Reset flow (Forgot Password / OTP verification / Reset Password).

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v4.0 (for sleek gradients, transitions, and glassmorphism layouts)
- **Routing**: React Router DOM v7
- **Charts**: Recharts (Custom Tooltips & Legends)
- **Icons**: React Icons
- **State & Alerts**: React Context API & React Hot Toast
- **Audio**: Custom Web Audio synth synthesis and audio buffers

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs hashing
- **Security & Config**: CORS policies & dotenv configurations

---

## 📁 Project Structure

```text
Expense-Tracker/
├── Backend/
│   ├── config/             # DB connection logic
│   ├── controller/         # Request handlers (auth, expense, income, dashboard)
│   ├── middleware/         # JWT verification & auth check middleware
│   ├── models/             # Mongoose schemas (User, Income, Expense)
│   ├── routes/             # API routes
│   └── server.js           # Express app entry point
├── Frontend/
│   ├── public/             # Static public assets
│   ├── src/
│   │   ├── components/     # Reusable components (Drawer, ThemeToggle, Charts, Console, CommandPalette)
│   │   ├── context/        # ThemeContext and UserContext
│   │   ├── hooks/          # Authentication hooks
│   │   ├── pages/          # Page layouts (Dashboard, Home, Income, Expense, Auth pages)
│   │   ├── utils/          # Helper files, custom audio player, api path setup
│   │   └── App.jsx         # App router config
│   └── vite.config.js      # Vite compilation settings
└── screenshots/            # UI screenshots for documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local instance or MongoDB Atlas cluster URI)

### Backend Setup
1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and add your configurations:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_uri
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:5173
   ```
4. Start the development server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the `Frontend` directory:
   ```bash
   cd ../Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Frontend/` folder:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

---

## 🔒 License
Distributed under the MIT License. See `LICENSE` for more information.
