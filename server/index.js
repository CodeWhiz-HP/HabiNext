import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import habitRoutes from './routes/habits.js';

dotenv.config();
const app = express();
app.use(cors({
  origin: [
    'https://habinext-client-fsditqd1m-codewhiz-hps-projects.vercel.app',
    'https://habinext.vercel.app' 
  ],
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
