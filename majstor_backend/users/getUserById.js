const pool = require("../database");

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await pool.connect();
    const result = await user.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const foundUser = result.rows[0];
    user.release();

    res.json(foundUser);
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { getUserById };
