const pool = require("../database");
const nodemailer = require("nodemailer");
const emailConfig = require("../emailConfig");

const sendResetEmail = async (email, resetLink) => {
  try {
    const transporter = nodemailer.createTransport(emailConfig);

    const mailOptions = {
      from: "elhapvc@gmail.com",
      to: email,
      subject: "Password Reset",
      text: `Click the following link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    return "Password reset email sent. Please check your email for further instructions.";
  } catch (error) {
    console.error("Error sending password reset email", error);
    throw new Error("Error sending password reset email");
  }
};

forgotPassword = async (req, res) => {
  const { mail } = req.body;

  if (!mail) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE mail = $1", [
      mail,
    ]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetLink = `http://localhost:5173/resetPassword`;

    const resetEmailMessage = await sendResetEmail(mail, resetLink);

    res.json({ message: resetEmailMessage });
  } catch (err) {
    console.error("Error executing forgot password logic", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { forgotPassword };
