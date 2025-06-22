import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({
  diagnosis: String,
  visitDate: { type: Date, required: true },
  nextVisitDate: { type: Date }, 
  doctorName: String,
  reportUrl: String,
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AddMember",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
});

export const MedicalRecord= mongoose.model('MedicalRecord', medicalRecordSchema);
