const pool = require("../database");

const deleteUserById = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await pool.connect();

    // Check if the user exists
    const checkUserResult = await user.query(
      "SELECT * FROM users WHERE id = $1",
      [userId]
    );

    if (checkUserResult.rows.length === 0) {
      user.release();
      return res.status(404).json({ error: "User not found" });
    }

    // Save comments by setting user_id to null.
    await user.query(
      "update ratings_comments set user_id = null where user_id = $1",
      [userId]
    );

    // Delete comments
    await user.query(
      "delete from ratings_comments where comment_id in (select rc.comment_id from ratings_comments rc left join posts p on p.post_id = rc.post_id where p.user_id = $1)",
      [userId]
    );

    // Delete associated posts
    await user.query("DELETE FROM posts WHERE user_id = $1", [userId]);

    // Delete the user
    await user.query("DELETE FROM users WHERE id = $1", [userId]);
    user.release();

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { deleteUserById };
