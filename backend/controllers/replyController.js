const Reply = require("../models/Reply");
const Comment = require("../models/Comment");
const asyncHandler = require("../utils/asyncHandler");

// Add a reply to a comment
const addReply = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const { commentId } = req.params;

  const newReply = new Reply({
    text,
    user: req.user.id,
    comment: commentId,
  });

  await newReply.save();

  // Push the new reply into the comment's replies array
  await Comment.findByIdAndUpdate(commentId, {
    $push: { replies: newReply._id },
  });

  res.status(201).json(newReply);
});

// Get all replies of a comment
const getReplies = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const replies = await Reply.find({ comment: commentId })
    .populate("user", "username email")
    .sort({ createdAt: 1 });

  res.json(replies);
});

// Delete a reply
const deleteReply = asyncHandler(async (req, res) => {
  const { replyId } = req.params;

  const reply = await Reply.findById(replyId);
  if (!reply) {
    res.status(404);
    throw new Error("Reply not found");
  }

  // Check if the user is the owner of the reply
  if (reply.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Unauthorized");
  }

  // Remove the reply reference from the comment
  await Comment.findByIdAndUpdate(reply.comment, {
    $pull: { replies: replyId },
  });

  await Reply.findByIdAndDelete(replyId);

  res.json({ message: "Reply deleted successfully" });
});

const likeReply = asyncHandler(async (req, res) => {
  const reply = await Reply.findByIdAndUpdate(
    req.params.replyId,
    { $addToSet: { likes: req.user.id } },
    { new: true }
  );
  if (!reply) {
    res.status(404);
    throw new Error("Reply not found");
  }
  res.status(200).json({ message: "Liked reply", reply });
});

const unlikeReply = asyncHandler(async (req, res) => {
  const reply = await Reply.findByIdAndUpdate(
    req.params.replyId,
    { $pull: { likes: req.user.id } },
    { new: true }
  );
  if (!reply) {
    res.status(404);
    throw new Error("Reply not found");
  }
  res.status(200).json({ message: "Unliked reply", reply });
});

module.exports = {
  addReply,
  getReplies,
  deleteReply,
  likeReply,
  unlikeReply,
};
