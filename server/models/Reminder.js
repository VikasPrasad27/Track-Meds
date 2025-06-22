// models/Reminder.js
import mongoose from "mongoose"

const reminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    familyMemberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AddMember", // Changed from "FamilyMember" to "AddMember"
      default: null,
      validate: {
        validator: (v) => {
          // Allow null, undefined, or valid ObjectId
          return v === null || v === undefined || mongoose.Types.ObjectId.isValid(v)
        },
        message: "familyMemberId must be a valid ObjectId or null",
      },
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    reminderType: {
      type: String,
      enum: ["visit", "checkup", "medication", "test", "appointment", "other"],
      required: true,
    },
    reminderDate: {
      type: Date,
      required: true,
    },
    reminderTime: {
      type: String, // Format: "HH:MM"
      required: true,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringType: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    notificationMethods: [
      {
        type: String,
        enum: ["browser", "email"],
        default: "browser",
      },
    ],
    notificationSent: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  {
    timestamps: true,
  },
)

// Pre-save middleware to handle empty strings
reminderSchema.pre("save", function (next) {
  if (this.familyMemberId === "") {
    this.familyMemberId = null
  }
  next()
})

// Pre-update middleware to handle empty strings
reminderSchema.pre(["findOneAndUpdate", "updateOne", "updateMany"], function (next) {
  const update = this.getUpdate()
  if (update.familyMemberId === "") {
    update.familyMemberId = null
  }
  next()
})

// Index for efficient queries
reminderSchema.index({ userId: 1, reminderDate: 1 })
reminderSchema.index({ reminderDate: 1, isActive: 1 })

export const Reminder = mongoose.model("Reminder", reminderSchema)
