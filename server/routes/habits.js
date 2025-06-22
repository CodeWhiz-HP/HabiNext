import express from "express";
import { Habit } from "../models/Habit.js";
import { verifyToken } from "../firebaseAdmin.js";

const router = express.Router();

// GET habits for a user
router.get("/:userId", verifyToken, async (req, res) => {
  const habits = await Habit.find({ userId: req.params.userId });
  res.json(habits);
});

// POST add a new habit
router.post("/", verifyToken, async (req, res) => {
  const { userId, name } = req.body;
  const newHabit = await Habit.create({ userId, name });
  res.json(newHabit);
});

router.put('/:id/checkin', verifyToken, async (req, res) => {
  const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.uid });
  if (!habit) return res.status(404).json({ error: "Habit not found" });

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  // If it's a new day, reset daily flags
  if (habit.lastChecked !== today) {
    habit.checkedToday = false;
    habit.streakUpdatedToday = false;
  }

  // Toggle behavior
  if (!habit.checkedToday) {
    habit.checkedToday = true;
    if (!habit.streakUpdatedToday) {
      if (habit.lastChecked === yesterday) {
        habit.streak += 1;
      } else {
        habit.streak = 1;
      }
      habit.streakUpdatedToday = true;
    }
  } else {
    // UNCHECK: undo today's streak gain
    habit.checkedToday = false;
    if (habit.streakUpdatedToday) {
      habit.streak = Math.max(0, habit.streak - 1);
      habit.streakUpdatedToday = false;
    }
  }

  habit.lastChecked = today;

  const milestones = [7, 30, 100];

  milestones.forEach((m) => {
    const mStr = String(m);
    // ADD badge if streak == milestone and not already earned
    if (habit.streak === m && !habit.badges.includes(mStr)) {
      habit.badges.push(mStr);
    }

    // REMOVE badge if streak drops below milestone
    if (habit.streak < m && habit.badges.includes(mStr)) {
      habit.badges = habit.badges.filter(b => b !== mStr);
    }
  });



  await habit.save();
  res.json(habit);
});




router.delete("/:id", verifyToken, async (req, res) => {
  const deleted = await Habit.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.uid,
  });

  if (!deleted) {
    return res.status(404).json({ error: "Habit not found" });
  }

  res.json({ success: true });
});

export default router;
