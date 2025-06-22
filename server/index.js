import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import habitRoutes from './routes/habits.js';

dotenv.config();
const app = express();
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow non-browser tools like Postman

    const allowedOrigins = [
      'https://habinext.vercel.app', // ✅ your custom domain if you have one
      'http://localhost:3000'        // ✅ local dev
    ];

    // ✅ Allow all Vercel preview deployments
    if (origin.endsWith('.vercel.app') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use("/api/habits", habitRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB Connected");
});

app.get("/", (req, res) => {
  res.send("HabiNext API is running");
});

app.listen(5000, () => console.log("Server running on port 5000"));
