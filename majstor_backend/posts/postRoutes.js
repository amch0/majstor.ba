const express = require("express");
const { Router } = express;
const router = Router();

const verifyTokenMiddleware = require("../verifyToken");
const { createPost, upload } = require("./createPost");
const { getAllPosts } = require("./getAllPosts");
const { deletePost } = require("./deletePost");
const { updatePost } = require("./updatePost");

router.post(
  "/create-post",
  verifyTokenMiddleware,
  upload.array("workPictures", 10),
  createPost
);
router.get("/", getAllPosts);
router.put(
  "/update-post/:postId",
  verifyTokenMiddleware,
  upload.array("workPictures", 10),
  updatePost
);
router.delete("/delete-post/:postId", verifyTokenMiddleware, deletePost);

module.exports = router;
