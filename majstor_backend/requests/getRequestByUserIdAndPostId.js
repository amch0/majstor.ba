const pool = require("../database");

const getRequestByUserIdAndPostId = async (req, res) => {
  const user = await pool.connect();
  const { userId } = req.user;
  const { post_id } = req.query;

  try {
    // Check if the user with the given userId exists
    const userExistsQuery = await user.query(
      "SELECT EXISTS (SELECT 1 FROM users WHERE id = $1)",
      [userId]
    );

    const userExists = userExistsQuery.rows[0].exists;

    if (!userExists) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    // Get the request by user ID and post ID
    const requestQuery = await user.query(
      "SELECT * FROM requests WHERE user_id = $1 AND post_id = $2",
      [userId, post_id]
    );

    const request = requestQuery.rows[0];

    // if (!request) {
    //   res.status(404).json({ error: "Request not found." });
    //   return;
    // }

    if (!request) {
      // No request found, return an empty object
      res.status(200).json({ request: {} });
      return;
    }

    res.status(200).json({ request });
  } catch (error) {
    console.error("Error getting request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    user.release();
  }
};

module.exports = { getRequestByUserIdAndPostId };
