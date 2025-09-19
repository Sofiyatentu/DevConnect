const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  likePost,
  unlikePost,
} = require("../controllers/postController");

// The following lines were commented out to remove duplicates
// const {
//  addComment,
//  deleteComment,
// } = require("../controllers/commentController");

router.post("/", verifyToken, createPost);
router.get("/", verifyToken, getAllPosts);
router.get("/:id", verifyToken, getPostById);
router.delete("/:id", verifyToken, deletePost);
router.put("/like/:id", verifyToken, likePost);
router.put("/unlike/:id", verifyToken, unlikePost);

// These lines were removed to avoid duplicate route definitions
// router.post("/comments/:id", verifyToken, addComment);
// router.delete("/comments/:id/:comment_id", verifyToken, deleteComment);

module.exports = router;
