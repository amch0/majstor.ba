const pool = require("../database");

const getCommentsByPostId = async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if the post exists
    const postExistsResult = await pool.query(
      "SELECT * FROM posts WHERE post_id = $1",
      [postId]
    );

    if (postExistsResult.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    const commentsResult = await pool.query(
      "SELECT rc.comment_id, rc.user_id, u.name, u.surname, u.profile_picture, rc.post_id, rc.comment, rc.rating, rc.created_at " +
        "FROM ratings_comments rc " +
        "LEFT JOIN users u ON rc.user_id = u.id " +
        "WHERE rc.post_id = $1",
      [postId]
    );

    const comments = commentsResult.rows;

    res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { getCommentsByPostId };
