const pool = require("../database");
const bcrypt = require("bcrypt");

const resetPassword = async (req, res) => {
  const { mail, newPassword, confirmPassword } = req.body;

  if (!mail || !newPassword || !confirmPassword) {
    return res
      .status(400)
      .json({ error: "Email, newPassword, and confirmPassword are required" });
  }

  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json({ error: "New password and confirm password do not match" });
  }

  try {
    const user = await pool.connect();
    const result = await user.query("SELECT * FROM users WHERE mail = $1", [
      mail,
    ]);

    if (result.rows.length === 0) {
      user.release();
      return res.status(404).json({ error: "User not found" });
    }

    const userId = result.rows[0].id;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedPassword,
      userId,
    ]);

    user.release();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Error executing reset password logic", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { resetPassword };
