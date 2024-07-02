const pool = require("../database");

const deleteUserById = async (req, res) => {
  try {
    const { userId, userType } = req.user;

    const userToDeleteId = req.params.userId;

    // Check if the user making the request is an admin
    if (userType !== "admin") {
      return res
        .status(403)
        .json({ error: "Permission denied. Admin access required." });
    }

    const user = await pool.connect();

    // Check if the user to delete exists
    const checkUserResult = await user.query(
      "SELECT * FROM users WHERE id = $1",
      [userToDeleteId]
    );

    if (checkUserResult.rows.length === 0) {
      user.release();
      return res.status(404).json({ error: "User not found" });
    }

    // Delete associated posts

    // Save comments by setting user_id to null.
    await user.query(
      "UPDATE ratings_comments SET user_id = null WHERE user_id = $1",
      [userToDeleteId]
    );

    // Delete comments
    await user.query(
      "DELETE FROM ratings_comments WHERE comment_id IN (SELECT rc.comment_id FROM ratings_comments rc LEFT JOIN posts p ON p.post_id = rc.post_id WHERE p.user_id = $1)",
      [userToDeleteId]
    );

    await user.query("DELETE FROM posts WHERE user_id = $1", [userToDeleteId]);

    // Delete the user
    await user.query("DELETE FROM users WHERE id = $1", [userToDeleteId]);
    user.release();

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { deleteUserById };
