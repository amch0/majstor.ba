const express = require("express");
const { Router } = express;
const router = Router();

const verifyTokenMiddleware = require("../verifyToken");
const loginSession = require("./loginSession");
const { getAllUsers } = require("../users/getAllUsers");
const { getUserById } = require("../users/getUserById");
const { deleteUserById } = require("./deleteUserById");
const { getAllPosts } = require("../posts/getAllPosts");
const { deletePost } = require("../posts/deletePost");
const { getCommentsByPostId } = require("../comments/getCommentsByPostId");
const deleteComment = require("../comments/deleteComment");

router.get("/loginSession", verifyTokenMiddleware, loginSession);
router.get("/users", getAllUsers);
router.get("/posts", getAllPosts);
router.get("/:userId", getUserById);
router.delete("/:userId", verifyTokenMiddleware, deleteUserById);
router.delete("/post/:postId", verifyTokenMiddleware, deletePost);
router.get("/comments/:postId", getCommentsByPostId);
router.delete("/comment/:commentId", verifyTokenMiddleware, deleteComment);

module.exports = router;
