const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json(user);
});

const updateUser = asyncHandler(async (req, res) => {
  if (req.user.id !== req.params.id) {
    res.status(403);
    throw new Error("Not authorized");
  }

  const updates = req.body;
  const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedUser) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(updatedUser);
});

const deleteUser = asyncHandler(async (req, res) => {
  if (req.user.id !== req.params.id) {
    res.status(403);
    throw new Error("Not authorized");
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({ message: "User deleted successfully" });
});

module.exports = {
  getUser,
  updateUser,
  deleteUser,
};
