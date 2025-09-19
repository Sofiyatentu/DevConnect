const Comment = require("../models/Comment");
const Post = require("../models/Post");
const asyncHandler = require("../utils/asyncHandler");

// Add a comment to a post
const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const { postId } = req.params;

  const newComment = new Comment({
    text,
    user: req.user.id, // from verifyToken
    post: postId,
  });

  await newComment.save();

  // Push comment into post's comments array
  await Post.findByIdAndUpdate(postId, {
    $push: { comments: newComment._id },
  });

  res.status(201).json(newComment);
});

// Get all comments of a post
const getComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ post: postId })
    .populate("user", "username email")
    .populate({
      path: "replies",
      populate: { path: "user", select: "username email" },
    });

  res.json(comments);
});

// Delete a comment
const deleteComment = asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }
  // Only owner of comment can delete
  if (comment.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Unauthorized");
  }

  await Comment.findByIdAndDelete(commentId);

  // Remove comment reference from post
  await Post.findByIdAndUpdate(postId, {
    $pull: { comments: commentId },
  });

  res.json({ message: "Comment deleted successfully" });
});

const likeComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user.id } },
    { new: true }
  );
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }
  res.status(200).json({ message: "Liked comment", comment });
});

const unlikeComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user.id } },
    { new: true }
  );
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }
  res.status(200).json({ message: "Unliked comment", comment });
});

module.exports = {
  addComment,
  getComments,
  deleteComment,
  likeComment,
  unlikeComment,
};
