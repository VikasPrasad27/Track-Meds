import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { MedicalRecord } from "../models/MedicalRecord.js"

const addRecord = asyncHandler(async (req, res) => {
  const { diagnosis, visitDate, nextVisitDate, doctorName } = req.body
  const memberId = req.body?.memberId
  const visitDateObj = new Date(visitDate)
  const nextVisitDateObj = nextVisitDate ? new Date(nextVisitDate) : null

  // 1. Validate required fields - nextVisitDate is optional
  if (!diagnosis || !visitDate || !doctorName || !memberId) {
    throw new ApiError(400, "Diagnosis, visitDate, doctorName, and memberId are required")
  }

  // 2. Upload medical record image (optional)
  let uploadedRecord = null
  const recordsLocalPath = req.files?.reportUrl?.[0]?.path

  if (recordsLocalPath) {
    uploadedRecord = await uploadOnCloudinary(recordsLocalPath)
    if (!uploadedRecord?.url) {
      throw new ApiError(500, "Failed to upload medical record image")
    }
  }

  // 3. Create medical record
  const record = await MedicalRecord.create({
    diagnosis,
    visitDate: visitDateObj,
    nextVisitDate: nextVisitDateObj,
    doctorName,
    reportUrl: uploadedRecord?.url || null,
    memberId,
    user: req.user._id,
  })

  if (!record) {
    throw new ApiError(500, "Something went wrong while adding medical record")
  }

  // 4. Populate the member information before returning
  const populatedRecord = await MedicalRecord.findById(record._id).populate("memberId", "name relation age gender")

  // 5. Return response
  return res.status(201).json(new ApiResponse(201, populatedRecord, "Medical Record added successfully"))
})

// NEW: Get all records for the logged-in user
const getAllRecords = asyncHandler(async (req, res) => {
  const records = await MedicalRecord.find({
    user: req.user._id, // Get all records for the logged-in user
  })
    .populate("memberId", "name relation age gender") // Populate member information
    .sort({ visitDate: -1 }) // Sort by visit date (newest first)

  return res.status(200).json(new ApiResponse(200, records, "Medical records fetched successfully"))
})

const getRecordsByMember = asyncHandler(async (req, res) => {
  const memberId = req.body?.memberId

  if (!memberId) {
    throw new ApiError(400, "memberId is required")
  }

  const records = await MedicalRecord.find({
    memberId: memberId,
    user: req.user._id, // ensures only records of logged-in user
  })
    .populate("memberId", "name relation age gender")
    .sort({ visitDate: -1 })

  if (!records || records.length === 0) {
    throw new ApiError(404, "No records found for this member")
  }

  return res.status(200).json(new ApiResponse(200, records, "Medical records fetched successfully"))
})

const deleteRecord = asyncHandler(async (req, res) => {
  const { recordId } = req.body

  if (!recordId) {
    throw new ApiError(400, "recordId is required")
  }
  const record = await MedicalRecord.findOne({
    _id: recordId,
    user: req.user._id,
  })

  if (!record) {
    throw new ApiError(404, "Medical record not found or unauthorized")
  }

  await MedicalRecord.deleteOne({ _id: recordId })

  return res.status(200).json(new ApiResponse(200, null, "Medical record deleted successfully"))
})

export { addRecord, getAllRecords, getRecordsByMember, deleteRecord }
