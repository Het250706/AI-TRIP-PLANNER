import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import flash from 'express-flash';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import errorHandler from './middlewares/errorHandler.js';

// Routes
import usersRouter from './routes/userRouter.js';
import authRouter from './routes/authRouter.js';
import airoutes from './routes/airoutes.js';
import tripRoutes from './routes/tripRoutes.js';

dotenv.config();

// Connect to Database
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5555;

// Middleware
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || 'highhook',
    cookie: { maxAge: 60000 * 60 * 24 }, // 1 day
  })
);
app.use(flash());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/ai', airoutes);
app.use('/api/trip', tripRoutes);

// Default Route
app.get('/', (req, res) => {
  res.send('<h1>WELCOME AI TRIP PLANNER API</h1>');
});

// Error Handler (Keep at the end)
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
