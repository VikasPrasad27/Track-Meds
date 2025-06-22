import Router from "express"
import {
  createReminder,
  getTodayReminders,
  updateReminder,
  deleteReminder,
  getReminderStats,
  getReminders,
  markReminderCompleted,
} from "../controllers/reminder.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js" // Your auth middleware

const router = Router()

router.use(verifyJWT)


router.post("/", createReminder)
router.get("/", getReminders)
router.get("/today", getTodayReminders)
router.get("/stats", getReminderStats)
router.put("/:id", updateReminder)
router.patch("/:id/complete", markReminderCompleted)
router.delete("/:id", deleteReminder)

export default router

