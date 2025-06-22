import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  name: String,
  age: Number,
  relation: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},{timestamps:true});

export const AddMember = mongoose.model('AddMember', memberSchema);
