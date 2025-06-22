import mongoose from "mongoose";

const habitSchema = new mongoose.Schema({
  userId: String,
  name: String,
  streak: { type: Number, default: 0 },
  lastChecked: String,
  checkedToday: { type: Boolean, default: false },
  streakUpdatedToday: { type: Boolean, default: false },

  badges: {
    type: [String],
    default: [],
  }
});

export const Habit = mongoose.model("Habit", habitSchema);