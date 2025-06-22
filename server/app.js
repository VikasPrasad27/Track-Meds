import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnection } from "./db/connection.js";
import userRouter from './routes/user.routes.js';
import memberRouter from './routes/member.routes.js'
import recordRouter from './routes/record.routes.js'
import reminderRoutes from './routes/reminder.routes.js'
import dotenv from "dotenv";


const app = express();
dotenv.config();

app.use(cors({
    origin: process.env.FRONTEND_VITE_URL||'http://localhost:5173', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200
}));

import { startReminderService } from './services/notificationService.js';
startReminderService();

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

//routes
app.use("/users", userRouter);

app.use("/members",memberRouter);

app.use("/records",recordRouter);

app.use("/reminders", reminderRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export { app };
