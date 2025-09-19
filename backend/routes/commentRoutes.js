const express = require("express");
const {
  addComment,
  getComments,
  deleteComment,
  likeComment,
  unlikeComment,
} = require("../controllers/commentController");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// Add a comment to a post
router.post("/:postId", verifyToken, addComment);

// Get all comments of a post
router.get("/:postId", getComments);

// Delete a comment
router.delete("/:postId/:commentId", verifyToken, deleteComment);

// Like a comment
router.put("/:postId/:commentId/like", verifyToken, likeComment);

// Unlike a comment
router.put("/:postId/:commentId/unlike", verifyToken, unlikeComment);

module.exports = router;
