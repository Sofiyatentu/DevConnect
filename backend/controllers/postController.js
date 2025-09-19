const Post = require("../models/Post");
const asyncHandler = require("../utils/asyncHandler");

const createPost = asyncHandler(async (req, res) => {
  console.log("Request Body:", req.body);
  console.log("Request User:", req.user);

  if (!req.body.text) {
    res.status(400);
    throw new Error("Text content is required to create a post.");
  }

  const newPost = new Post({
    user: req.user.id,
    text: req.body.text,
  });
  const savedPost = await newPost.save();
  res.status(201).json(savedPost);
});

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate("user", "name")
    .sort({ createdAt: -1 });
  res.status(200).json(posts);
});

const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("user", "name");
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  res.status(200).json(post);
});

const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  if (post.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Unauthorised action");
  }
  await post.deleteOne();
  res.status(200).json({ message: "Post deleted successfully" });
});

const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user.id } },
    { new: true }
  );
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  res.status(200).json({ message: "Liked Post", post });
});

const unlikePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user.id } },
    { new: true }
  );
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  res.status(200).json({ message: "Liked Post", post });
});

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  likePost,
  unlikePost,
};
