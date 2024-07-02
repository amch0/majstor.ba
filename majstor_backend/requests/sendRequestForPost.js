const pool = require("../database");

const sendRequestForPost = async (req, res) => {
  const user = await pool.connect();
  const { userId, userType } = req.user;
  const { post_id } = req.body;

  try {
    // Check if the user with the given userId exists and has userType as "client"
    const userExistsQuery = await user.query(
      "SELECT EXISTS (SELECT 1 FROM users WHERE id = $1 AND type = 'client')",
      [userId]
    );

    const userExists = userExistsQuery.rows[0].exists;

    if (!userExists) {
      res.status(403).json({ error: "User not authorized to send requests." });
      return;
    }

    // Check if the post with the given post_id exists
    const postExistsQuery = await user.query(
      "SELECT EXISTS (SELECT 1 FROM posts WHERE post_id = $1)",
      [post_id]
    );

    const postExists = postExistsQuery.rows[0].exists;

    if (postExists) {
      // Insert a request into the requests table
      await user.query(
        "INSERT INTO requests (user_id, post_id, allowed, created_at) VALUES ($1, $2, $3, $4)",
        [userId, post_id, null, new Date()]
      );

      res.status(200).json({ message: "Request sent successfully." });
    } else {
      res.status(404).json({ error: "Post not found." });
    }
  } catch (error) {
    console.error("Error sending request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    user.release();
  }
};

module.exports = sendRequestForPost;
