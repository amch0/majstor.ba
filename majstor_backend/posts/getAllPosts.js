// const pool = require("../database");
// const querystring = require("querystring");

// const getAllPosts = async (req, res) => {
//   try {
//     const {
//       user_id,
//       post_id,
//       page = 1,
//       pageSize = 10,
//       service,
//       location,
//     } = req.query;

//     let queryParams = [];
//     let whereClause = "";
//     let joinClause = "";

//     if (user_id) {
//       whereClause = " WHERE p.user_id = $1";
//       queryParams = [user_id];
//     } else if (post_id) {
//       whereClause = " WHERE p.post_id = $1";
//       queryParams = [post_id];
//     }

//     if (service) {
//       whereClause +=
//         queryParams.length > 0
//           ? ` AND p.service ILIKE '%' || $${queryParams.length + 1} || '%'`
//           : ` WHERE p.service ILIKE '%' || $${queryParams.length + 1} || '%'`;
//       queryParams.push(service);
//     }

//     if (location) {
//       joinClause = " LEFT JOIN users u ON p.user_id = u.id";
//       whereClause +=
//         queryParams.length > 0
//           ? ` AND u.location ILIKE '%' || $${queryParams.length + 1} || '%'`
//           : ` WHERE u.location ILIKE '%' || $${queryParams.length + 1} || '%'`;
//       queryParams.push(location);
//     }

//     // Add pagination to the query
//     const query = `
//       SELECT p.*
//       FROM posts p
//       ${joinClause}
//       ${whereClause}
//       ORDER BY p.post_id
//       LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
//     `;

//     // Combine queryParams with additional pagination parameters
//     const params = [...queryParams, +pageSize, (page - 1) * +pageSize];

//     const result = await pool.query(query, params);

//     // Check if any posts are found
//     if (queryParams.length > 0 && result.rows.length === 0) {
//       return res
//         .status(404)
//         .json({ success: false, message: "No posts found" });
//     }

//     res.status(200).json({ success: true, posts: result.rows });
//   } catch (error) {
//     console.error("Error retrieving posts:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// module.exports = { getAllPosts };

const pool = require("../database");
const querystring = require("querystring");

const getAllPosts = async (req, res) => {
  try {
    const {
      user_id,
      post_id,
      page = 1,
      pageSize = 10,
      service,
      location,
    } = req.query;

    let queryParams = [];
    let whereClause = "";
    let joinClause = "";

    if (user_id) {
      whereClause = " WHERE p.user_id = $1";
      queryParams = [user_id];
    } else if (post_id) {
      whereClause = " WHERE p.post_id = $1";
      queryParams = [post_id];
    }

    if (service) {
      whereClause +=
        queryParams.length > 0
          ? ` AND p.service ILIKE '%' || $${queryParams.length + 1} || '%'`
          : ` WHERE p.service ILIKE '%' || $${queryParams.length + 1} || '%'`;
      queryParams.push(service);
    }

    if (location) {
      joinClause = " LEFT JOIN users u ON p.user_id = u.id";
      whereClause +=
        queryParams.length > 0
          ? ` AND u.location ILIKE '%' || $${queryParams.length + 1} || '%'`
          : ` WHERE u.location ILIKE '%' || $${queryParams.length + 1} || '%'`;
      queryParams.push(location);
    }

    // Count the total number of posts without pagination
    const countQuery = `
      SELECT COUNT(*) AS total_count
      FROM posts p
      ${joinClause}
      ${whereClause}
    `;

    const countResult = await pool.query(countQuery, queryParams);
    const totalCount =
      countResult.rows.length > 0 ? countResult.rows[0].total_count : 0;

    const query = `
      SELECT p.*
      FROM posts p
      ${joinClause}
      ${whereClause}
      ORDER BY p.post_id
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;

    // Combine queryParams with additional pagination parameters
    const params = [...queryParams, +pageSize, (page - 1) * +pageSize];

    const result = await pool.query(query, params);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalCount / +pageSize);

    res.status(200).json({
      success: true,
      totalPages,
      currentPage: +page,
      posts: result.rows,
      totalPages,
      currentPage: +page,
    });
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { getAllPosts };
