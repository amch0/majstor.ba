const pool = require("../database");

const deleteComment = async (req, res) => {
  try {
    const { userId, userType } = req.user;
    const { commentId } = req.params;

    // Check if the comment exists
    const commentExistsResult = await pool.query(
      "SELECT * FROM ratings_comments WHERE comment_id = $1",
      [commentId]
    );

    if (commentExistsResult.rows.length === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if the user is the author of the comment or an admin
    const commentUserId = commentExistsResult.rows[0].user_id;

    if (userType === "admin" || userId === commentUserId) {
      await pool.query("DELETE FROM ratings_comments WHERE comment_id = $1", [
        commentId,
      ]);

      res
        .status(200)
        .json({ success: true, message: "Comment deleted successfully" });
    } else {
      res.status(403).json({
        success: false,
        message: "Not authorized to delete this comment",
      });
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = deleteComment;
