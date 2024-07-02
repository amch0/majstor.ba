const pool = require("../database");
const bcrypt = require("bcrypt");

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const { userId } = req.user;

    const user = await pool.connect();

    // Check if the current password matches the one in the database
    const result = await user.query(
      "SELECT password FROM users WHERE id = $1",
      [userId]
    );
    const hashedPasswordInDB = result.rows[0].password;

    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      hashedPasswordInDB
    );

    if (!isPasswordMatch) {
      user.release();
      return res
        .status(401)
        .json({ error: "Unauthorized - Current password is incorrect" });
    }

    if (newPassword !== confirmPassword) {
      user.release();
      return res
        .status(400)
        .json({
          error: "Bad Request - New password and confirm password do not match",
        });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await user.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedNewPassword,
      userId,
    ]);
    user.release();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { changePassword };
