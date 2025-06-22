import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Reminder } from "../models/Reminder.js"
import { AddMember } from "../models/AddMember.js"

// Create a new reminder
const createReminder = asyncHandler(async (req, res) => {
  const {
    familyMemberId,
    title,
    description,
    reminderType,
    reminderDate,
    reminderTime,
    isRecurring,
    recurringType,
    notificationMethods,
    priority,
  } = req.body

  // Validate required fields
  if (!title || !reminderType || !reminderDate || !reminderTime) {
    throw new ApiError(400, "Title, type, date, and time are required")
  }

  // Clean familyMemberId - convert empty string to null
  const cleanFamilyMemberId = familyMemberId === "" ? null : familyMemberId

  // If familyMemberId is provided, verify it exists and belongs to the user
  if (cleanFamilyMemberId) {
    const familyMember = await AddMember.findOne({
      _id: cleanFamilyMemberId,
      userId: req.user._id,
    })

    if (!familyMember) {
      throw new ApiError(404, "Family member not found")
    }
  }

  // Create reminder
  const reminder = await Reminder.create({
    userId: req.user._id,
    familyMemberId: cleanFamilyMemberId,
    title,
    description,
    reminderType,
    reminderDate: new Date(reminderDate),
    reminderTime,
    isRecurring: isRecurring || false,
    recurringType: isRecurring ? recurringType : null,
    notificationMethods: notificationMethods || ["browser"],
    priority: priority || "medium",
  })

  // Populate the created reminder
  const populatedReminder = await Reminder.findById(reminder._id)
    .populate("userId", "name email")
    .populate("familyMemberId", "name relation")

  res.status(201).json(new ApiResponse(201, populatedReminder, "Reminder created successfully"))
})

// Get all reminders for the authenticated user
const getReminders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, type, status, memberId } = req.query

  // Build filter
  const filter = { userId: req.user._id }

  if (type && type !== "all") {
    filter.reminderType = type
  }

  if (status === "completed") {
    filter.isCompleted = true
  } else if (status === "active") {
    filter.isActive = true
    filter.isCompleted = false
  }

  if (memberId && memberId !== "all") {
    filter.familyMemberId = memberId === "self" ? null : memberId
  }

  // Get reminders with pagination
  const reminders = await Reminder.find(filter)
    .populate("userId", "name email")
    .populate("familyMemberId", "name relation")
    .sort({ reminderDate: 1, reminderTime: 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)

  const total = await Reminder.countDocuments(filter)

  res.status(200).json(
    new ApiResponse(
      200,
      {
        reminders,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      },
      "Reminders fetched successfully",
    ),
  )
})

// Get a single reminder by ID
const getReminderById = asyncHandler(async (req, res) => {
  const { id } = req.params

  const reminder = await Reminder.findOne({
    _id: id,
    userId: req.user._id,
  })
    .populate("userId", "name email")
    .populate("familyMemberId", "name relation")

  if (!reminder) {
    throw new ApiError(404, "Reminder not found")
  }

  res.status(200).json(new ApiResponse(200, reminder, "Reminder fetched successfully"))
})

// Update a reminder
const updateReminder = asyncHandler(async (req, res) => {
  const { id } = req.params
  const updateData = req.body

  // Clean familyMemberId if present
  if (updateData.familyMemberId === "") {
    updateData.familyMemberId = null
  }

  // If familyMemberId is being updated, verify it exists
  if (updateData.familyMemberId) {
    const familyMember = await AddMember.findOne({
      _id: updateData.familyMemberId,
      userId: req.user._id,
    })

    if (!familyMember) {
      throw new ApiError(404, "Family member not found")
    }
  }

  const reminder = await Reminder.findOneAndUpdate({ _id: id, userId: req.user._id }, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("userId", "name email")
    .populate("familyMemberId", "name relation")

  if (!reminder) {
    throw new ApiError(404, "Reminder not found")
  }

  res.status(200).json(new ApiResponse(200, reminder, "Reminder updated successfully"))
})

// Delete a reminder
const deleteReminder = asyncHandler(async (req, res) => {
  const { id } = req.params

  const reminder = await Reminder.findOneAndDelete({
    _id: id,
    userId: req.user._id,
  })

  if (!reminder) {
    throw new ApiError(404, "Reminder not found")
  }

  res.status(200).json(new ApiResponse(200, {}, "Reminder deleted successfully"))
})

// Mark reminder as completed
const markReminderCompleted = asyncHandler(async (req, res) => {
  const { id } = req.params

  const reminder = await Reminder.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    { isCompleted: true },
    { new: true },
  )
    .populate("userId", "name email")
    .populate("familyMemberId", "name relation")

  if (!reminder) {
    throw new ApiError(404, "Reminder not found")
  }

  res.status(200).json(new ApiResponse(200, reminder, "Reminder marked as completed"))
})

// Get reminder statistics
const getReminderStats = asyncHandler(async (req, res) => {
  const userId = req.user._id

  // Get current date
  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0))
  const endOfDay = new Date(today.setHours(23, 59, 59, 999))

  // Get stats
  const [
    totalReminders,
    activeReminders,
    completedReminders,
    todayReminders,
    overdueReminders,
    upcomingReminders,
    remindersByType,
    remindersByPriority,
  ] = await Promise.all([
    // Total reminders
    Reminder.countDocuments({ userId }),

    // Active reminders
    Reminder.countDocuments({ userId, isActive: true, isCompleted: false }),

    // Completed reminders
    Reminder.countDocuments({ userId, isCompleted: true }),

    // Today's reminders
    Reminder.countDocuments({
      userId,
      reminderDate: { $gte: startOfDay, $lte: endOfDay },
      isActive: true,
      isCompleted: false,
    }),

    // Overdue reminders
    Reminder.countDocuments({
      userId,
      reminderDate: { $lt: startOfDay },
      isActive: true,
      isCompleted: false,
    }),

    // Upcoming reminders (next 7 days)
    Reminder.countDocuments({
      userId,
      reminderDate: {
        $gt: endOfDay,
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      isActive: true,
      isCompleted: false,
    }),

    // Reminders by type
    Reminder.aggregate([{ $match: { userId } }, { $group: { _id: "$reminderType", count: { $sum: 1 } } }]),

    // Reminders by priority
    Reminder.aggregate([{ $match: { userId } }, { $group: { _id: "$priority", count: { $sum: 1 } } }]),
  ])

  const stats = {
    total: totalReminders,
    active: activeReminders,
    completed: completedReminders,
    today: todayReminders,
    overdue: overdueReminders,
    upcoming: upcomingReminders,
    byType: remindersByType.reduce((acc, item) => {
      acc[item._id] = item.count
      return acc
    }, {}),
    byPriority: remindersByPriority.reduce((acc, item) => {
      acc[item._id] = item.count
      return acc
    }, {}),
  }

  res.status(200).json(new ApiResponse(200, stats, "Reminder statistics fetched successfully"))
})

// Get today's reminders
const getTodayReminders = asyncHandler(async (req, res) => {
  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0))
  const endOfDay = new Date(today.setHours(23, 59, 59, 999))

  const reminders = await Reminder.find({
    userId: req.user._id,
    reminderDate: { $gte: startOfDay, $lte: endOfDay },
    isActive: true,
  })
    .populate("userId", "name email")
    .populate("familyMemberId", "name relation")
    .sort({ reminderTime: 1 })

  res.status(200).json(new ApiResponse(200, reminders, "Today's reminders fetched successfully"))
})

// Get upcoming reminders
const getUpcomingReminders = asyncHandler(async (req, res) => {
  const { days = 7 } = req.query
  const today = new Date()
  const endOfToday = new Date(today.setHours(23, 59, 59, 999))
  const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000)

  const reminders = await Reminder.find({
    userId: req.user._id,
    reminderDate: { $gt: endOfToday, $lte: futureDate },
    isActive: true,
    isCompleted: false,
  })
    .populate("userId", "name email")
    .populate("familyMemberId", "name relation")
    .sort({ reminderDate: 1, reminderTime: 1 })

  res.status(200).json(new ApiResponse(200, reminders, "Upcoming reminders fetched successfully"))
})

export {
  createReminder,
  getReminders,
  getReminderById,
  updateReminder,
  deleteReminder,
  markReminderCompleted,
  getReminderStats,
  getTodayReminders,
  getUpcomingReminders,
}
