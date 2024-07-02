const express = require("express");
const { Router } = express;
const router = Router();
const pool = require("../database");

const verifyTokenMiddleware = require("../verifyToken");
const { registerUser, upload } = require("./registerUser");
const { getAllUsers } = require("./getAllUsers");
const { verifyUser } = require("./verifyUser");
const { getUserById } = require("./getUserById");
const { deleteUserById } = require("./deleteUser");
const { loginUser } = require("./loginUser");
const { forgotPassword } = require("./forgotPassword");
const { resetPassword } = require("./resetPassword");
const { getUserByToken } = require("./getUserByToken");
const { changePassword } = require("./changePassword");
const { updateUser, uploadUpdate } = require("./updateUser");

router.get("/", getAllUsers);
router.get("/by-token", verifyTokenMiddleware, (req, res) =>
  getUserByToken(req, res)
);
router.put(
  "/",
  verifyTokenMiddleware,
  uploadUpdate.single("profile_picture"),
  (req, res) => updateUser(req, res)
);
router.post("/reset-password", resetPassword);
router.get("/verify", (req, res) => verifyUser(req, res));
router.get("/:userId", getUserById);
router.delete("/", verifyTokenMiddleware, deleteUserById);
router.post("/register", upload.single("profilePicture"), registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/change-password", verifyTokenMiddleware, changePassword);

module.exports = router;
