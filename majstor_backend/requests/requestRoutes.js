const express = require("express");
const { Router } = express;
const router = Router();

const verifyTokenMiddleware = require("../verifyToken");
const sendRequestForPost = require("./sendRequestForPost");
const { getUserRequests } = require("./getUserRequests");
const updateRequestStatus = require("./updateRequestStatus");
const {
  getRequestByUserIdAndPostId,
} = require("./getRequestByUserIdAndPostId");

router.post("/", verifyTokenMiddleware, sendRequestForPost);
router.get("/userRequests", verifyTokenMiddleware, getUserRequests);
router.put(
  "/update-request-status",
  verifyTokenMiddleware,
  updateRequestStatus
);
router.get("/user-post", verifyTokenMiddleware, getRequestByUserIdAndPostId);

module.exports = router;
