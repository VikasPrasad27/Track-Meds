import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {AddMember} from "../models/AddMember.js";


// export const createMember = asyncHandler(async (req, res) => {
//     const { name, age, relation, gender } = req.body;

//     // 1. Validation: Check required fields
//     if (!name || !age || !relation) {
//     throw new ApiError(400, "Name, age and relation are required");
//   }

//     // 4. Create member in DB
//     const member = await AddMember.create({
//         name,
//         age,
//         relation,
//         gender,
//         user: req.user._id, // from auth middleware
//     });

//     // 5. Confirm creation
//     if (!member) {
//         throw new ApiError(500, "Something went wrong while adding member");
//     }

//     // 6. Respond
//     return res.status(201).json(
//         new ApiResponse(201, member, "Family member added successfully")
//     );
// });

export const createMember = asyncHandler(async (req, res) => {
  const { name, age, relation, gender } = req.body;
  const userId = req.user._id; // Get from authenticated user

  const newMember = new AddMember({
    name,
    age,
    relation,
    gender,
    userId: userId // Make sure this matches your schema
  });

  const savedMember = await newMember.save();
  res.status(201).json(new ApiResponse(201, savedMember, "Member added successfully"));
});
// ✅ Get all members for logged-in user
export const getAllMembers = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Change 'user' to 'userId' to match your schema
  const members = await AddMember.find({ userId: userId });

  res.status(200).json(new ApiResponse(200, members, "Fetched all members"));
});

// ✅ Get a single member by ID
export const getMemberById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const member = await AddMember.findOne({ _id: id, user: req.user._id });

  if (!member) {
    throw new ApiError(404, "Member not found");
  }

  res.status(200).json(new ApiResponse(200, member, "Fetched member"));
});

// ✅ Update a member
export const updateMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, age, relation, gender } = req.body;

  const updated = await AddMember.findOneAndUpdate(
    { _id: id, user: req.user._id },
    { name, age, relation, gender },
    { new: true }
  );

  if (!updated) {
    throw new ApiError(404, "Member not found or not authorized");
  }

  res.status(200).json(new ApiResponse(200, updated, "Member updated"));
});

// ✅ Delete a member
export const deleteMember = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleted = await AddMember.findOneAndDelete({ _id: id, user: req.user._id });

  if (!deleted) {
    throw new ApiError(404, "Member not found or not authorized");
  }

  res.status(200).json(new ApiResponse(200, deleted, "Member deleted"));
});

