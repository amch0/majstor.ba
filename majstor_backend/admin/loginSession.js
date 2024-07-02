const pool = require("../database");

const loginSession = async (req, res) => {
  try {
    const user = await pool.connect();
    const { userType } = req.user;

    // Check if the user is an admin
    if (userType !== "admin") {
      user.release();
      return res
        .status(403)
        .json({ error: "Permission denied. Admin access required." });
    }

    // Get pagination parameters from the request, default to page 1 and page size 10
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    const loginSessionsQuery = await user.query(
      "SELECT * FROM login_session ORDER BY login_time DESC OFFSET $1 LIMIT $2",
      [offset, pageSize]
    );

    const loginSessions = loginSessionsQuery.rows;

    user.release();

    res.status(200).json({ loginSessions });
  } catch (error) {
    console.error("Error retrieving login sessions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = loginSession;
