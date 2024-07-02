const express = require("express");
const { Router } = express;
const router = Router();

const verifyTokenMiddleware = require("../verifyToken");
const leaveComment = require("./leaveComment");
const { getCommentsByPostId } = require("./getCommentsByPostId");
const deleteComment = require("./deleteComment");

router.post("/", verifyTokenMiddleware, leaveComment);
router.get("/:postId", getCommentsByPostId);
router.delete("/:commentId", verifyTokenMiddleware, deleteComment);

module.exports = router;
