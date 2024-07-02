const pool = require("../database");

const getUserRequests = async (req, res) => {
  const user = await pool.connect();
  const { userId, userType } = req.user;

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

    let requestsQuery;

    if (userType === "client") {
      requestsQuery = await user.query(
        "SELECT r.*, p.title, u.name as post_creator_name, u.surname as post_creator_surname " +
          "FROM requests r " +
          "JOIN posts p ON r.post_id = p.post_id " +
          "JOIN users u ON p.user_id = u.id " +
          "WHERE r.user_id = $1",
        [userId]
      );
    } else if (userType === "craftsman") {
      requestsQuery = await user.query(
        "SELECT r.*, p.title, u.name as client_name, u.surname as client_surname " +
          "FROM requests r " +
          "JOIN posts p ON r.post_id = p.post_id " +
          "JOIN users u ON r.user_id = u.id " +
          "WHERE p.user_id = $1",
        [userId]
      );
    } else {
      res.status(400).json({ error: "Unsupported user type." });
      return;
    }

    const requests = requestsQuery.rows;
    res.status(200).json({ requests });
  } catch (error) {
    console.error("Error getting requests for user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    user.release();
  }
};

module.exports = { getUserRequests };
