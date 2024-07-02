const pool = require("../database");

const updateRequestStatus = async (req, res) => {
  const user = await pool.connect();
  const { userId, userType } = req.user;
  const { request_id, allowed } = req.body;

  try {
    // Check if the user with the given userId exists and has userType as "craftsman"
    const userExistsQuery = await user.query(
      "SELECT EXISTS (SELECT 1 FROM users WHERE id = $1 AND type = 'craftsman')",
      [userId]
    );

    const userExists = userExistsQuery.rows[0].exists;

    if (!userExists) {
      res
        .status(403)
        .json({ error: "User not authorized to update request status." });
      return;
    }

    // Check if the request with the given request_id exists and is associated with the craftsman's post
    const requestQuery = await user.query(
      "SELECT r.*, p.user_id as post_creator_id " +
        "FROM requests r " +
        "JOIN posts p ON r.post_id = p.post_id " +
        "WHERE r.request_id = $1",
      [request_id]
    );

    const request = requestQuery.rows[0];

    if (!request) {
      res.status(404).json({ error: "Request not found." });
      return;
    }

    // Check if the craftsman is the owner of the post associated with the request
    if (request.post_creator_id !== userId) {
      res
        .status(403)
        .json({
          error: "Craftsman not authorized to update request for this post.",
        });
      return;
    }

    // Update the allowed value in the requests table
    await user.query("UPDATE requests SET allowed = $1 WHERE request_id = $2", [
      allowed,
      request_id,
    ]);

    res.status(200).json({ message: "Request status updated successfully." });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    user.release();
  }
};

module.exports = updateRequestStatus;
