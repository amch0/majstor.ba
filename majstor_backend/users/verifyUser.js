const pool = require("../database");

const verifyUser = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const user = await pool.connect();
    const result = await user.query(
      "UPDATE users SET verified = true WHERE verification_token = $1 RETURNING *",
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Invalid token" });
    }

    const verifiedUser = result.rows[0];
    user.release();

    // res.json(verifiedUser);
    res.redirect("http://localhost:5173/login");
  } catch (err) {
    console.error("Error executing verification", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { verifyUser };
