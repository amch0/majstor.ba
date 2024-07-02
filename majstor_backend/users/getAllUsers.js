const pool = require("../database");

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, name, surname, rating } = req.query;

    let whereClause = "";
    if (name) {
      whereClause += ` AND name ILIKE '%${name}%'`;
    }
    if (surname) {
      whereClause += ` AND surname ILIKE '%${surname}%'`;
    }
    if (rating) {
      whereClause += ` AND rating >= ${rating}`;
    }

    const query = `
      SELECT *
      FROM users
      WHERE 1=1 ${whereClause}
      ORDER BY id
      LIMIT $1 OFFSET $2;
    `;

    const result = await pool.query(query, [pageSize, (page - 1) * pageSize]);
    const users = result.rows;

    res.json(users);
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { getAllUsers };
