const pool = require("../database");

const leaveComment = async (req, res) => {
  try {
    const { userId, userType } = req.user;

    if (userType === "client") {
      const { post_id, comment, rating } = req.body;
      const postId = Array.isArray(post_id) ? post_id[0] : post_id;

      // Check if the user exists
      const userExistsResult = await pool.query(
        "SELECT * FROM users WHERE id = $1",
        [userId]
      );

      if (userExistsResult.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if the post exists
      const postExistsResult = await pool.query(
        "SELECT * FROM posts WHERE post_id = $1",
        [postId]
      );

      if (postExistsResult.rows.length === 0) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Check if the user has a request for the post with allowed set to true
      const requestResult = await pool.query(
        "SELECT * FROM requests WHERE user_id = $1 AND post_id = $2 AND allowed = true",
        [userId, postId]
      );

      if (requestResult.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: "You need to request this service before leaving a comment",
        });
      }

      // Insert the comment into the ratings_comments table
      const result = await pool.query(
        "INSERT INTO ratings_comments (user_id, post_id, comment, rating) VALUES ($1, $2, $3, $4) RETURNING *",
        [userId, postId, comment, rating]
      );

      // Calculate and update average rating for the post creator
      const postCreatorResult = await pool.query(
        "SELECT user_id FROM posts WHERE post_id = $1",
        [postId]
      );

      const postCreatorId = postCreatorResult.rows[0].user_id;

      const postsResult = await pool.query(
        "SELECT post_id FROM posts WHERE user_id = $1",
        [postCreatorId]
      );

      const postIds = postsResult.rows.map((row) => row.post_id);

      const ratingsResult = await pool.query(
        "SELECT rating FROM ratings_comments WHERE post_id = ANY($1)",
        [postIds]
      );

      // Filter out rows with null or undefined ratings before calculating the average
      const validRatings = ratingsResult.rows
        .filter((row) => row.rating && row.rating !== null)
        .map((row) => parseFloat(row.rating));

      const averageRating =
        validRatings.length > 0
          ? validRatings.reduce((acc, rating) => acc + rating, 0) /
            validRatings.length
          : 0;

      await pool.query("UPDATE users SET rating = $1 WHERE id = $2", [
        averageRating,
        postCreatorId,
      ]);

      // Delete the request after leaving a comment
      await pool.query(
        "DELETE FROM requests WHERE user_id = $1 AND post_id = $2",
        [userId, postId]
      );

      res.status(201).json({ success: true, comment: result.rows[0] });
    } else {
      res.status(403).json({
        success: false,
        message: "Not authorized to leave comments",
      });
    }
  } catch (error) {
    console.error("Error leaving comment:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = leaveComment;
