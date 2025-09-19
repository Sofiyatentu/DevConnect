const express = require("express");
const {
  addReply,
  getReplies,
  deleteReply,
  likeReply,
  unlikeReply,
} = require("../controllers/replyController");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// Add a reply to a comment
router.post("/:commentId", verifyToken, addReply);

// Get all replies for a comment
router.get("/:commentId", getReplies);

// Delete a reply
router.delete("/:commentId/:replyId", verifyToken, deleteReply);

// Like a reply
router.put("/:replyId/like", verifyToken, likeReply);

// Unlike a reply
router.put("/:replyId/unlike", verifyToken, unlikeReply);

module.exports = router;
