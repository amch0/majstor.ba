const pool = require("../database");

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, userType } = req.user;

    // Check if the user is authorized to delete the post
    const postResult = await pool.query(
      "SELECT user_id FROM posts WHERE post_id = $1",
      [postId]
    );

    if (postResult.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const postUserId = postResult.rows[0].user_id;

    if (
      (userType === "craftsman" && userId === postUserId) ||
      userType === "admin"
    ) {
      await pool.query("DELETE FROM ratings_comments WHERE post_id = $1", [
        postId,
      ]);
      await pool.query("DELETE FROM posts WHERE post_id = $1", [postId]);

      res.json({ success: true, message: "Post deleted successfully" });
    } else {
      res.status(403).json({
        success: false,
        message: "Not authorized to delete this post",
      });
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { deletePost };
