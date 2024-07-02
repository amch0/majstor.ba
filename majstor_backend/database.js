const { Pool } = require("pg");
const config = require("./config");

const pool = new Pool(config);

pool.on("error", (err, user) => {
  console.error("Unexpected error on idle user", err);
  process.exit(-1);
});

// const createUsersTable = async () => {
//   const user = await pool.connect();

//   try {
//     // Check if the users table exists
//     const tableExistsQuery = await user.query(
//       "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users')"
//     );

//     const tableExists = tableExistsQuery.rows[0].exists;

//     if (!tableExists) {
//       // Execute the script to create the users table
//       await user.query(`
//         CREATE TABLE users (
//           id VARCHAR(255) PRIMARY KEY,
//           type VARCHAR(255),
//           name VARCHAR(255),
//           surname VARCHAR(255),
//           mail VARCHAR(255),
//           phone_number VARCHAR(20),
//           location VARCHAR(255),
//           profile_picture TEXT,
//           password VARCHAR(255) NOT NULL,
//           rating DECIMAL(10, 2),
//           verified BOOLEAN NOT NULL,
//           verification_token VARCHAR(255) NOT NULL
//         );

//         CREATE INDEX IF NOT EXISTS idx_users_mail ON users(mail);
//       `);

//       console.log("Users table created successfully.");
//     } else {
//       console.log("Users table already exists.");
//     }

//     // Create the posts table
//     const postsTableExistsQuery = await user.query(
//       "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'posts')"
//     );

//     const postsTableExists = postsTableExistsQuery.rows[0].exists;

//     if (!postsTableExists) {
//       // Execute the script to create the posts table
//       await user.query(`
//         CREATE TABLE posts (
//           post_id SERIAL PRIMARY KEY,
//           user_id VARCHAR(255) REFERENCES users(id),
//           title VARCHAR(255) NOT NULL,
//           service VARCHAR(255),
//           content TEXT,
//           price VARCHAR(50),
//           work_pictures TEXT[],
//           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//         );
//       `);

//       console.log("Posts table created successfully.");
//     } else {
//       console.log("Posts table already exists.");
//     }

//     // Create the ratings_comments table
//     const ratingsCommentsTableExistsQuery = await user.query(
//       "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ratings_comments')"
//     );

//     const ratingsCommentsTableExists =
//       ratingsCommentsTableExistsQuery.rows[0].exists;

//     if (!ratingsCommentsTableExists) {
//       // Execute the script to create the ratings_comments table
//       await user.query(`
//         CREATE TABLE ratings_comments (
//           comment_id SERIAL PRIMARY KEY,
//           user_id VARCHAR(255) REFERENCES users(id),
//           post_id SERIAL REFERENCES posts(post_id),
//           comment TEXT,
//           rating DECIMAL(10, 2),
//           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//         );
//       `);

//       console.log("Ratings and Comments table created successfully.");
//     } else {
//       console.log("Ratings and Comments table already exists.");
//     }

//     // Create the requests table
//     const requestsTableExistsQuery = await user.query(
//       "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'requests')"
//     );

//     const requestsTableExists = requestsTableExistsQuery.rows[0].exists;

//     if (!requestsTableExists) {
//       // Execute the script to create the requests table
//       await user.query(`
//         CREATE TABLE requests (
//           request_id SERIAL PRIMARY KEY,
//           user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
//           post_id SERIAL REFERENCES posts(post_id) ON DELETE CASCADE,
//           allowed BOOLEAN,
//           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//         );

//         CREATE INDEX IF NOT EXISTS idx_requests_user ON requests(user_id);
//         CREATE INDEX IF NOT EXISTS idx_requests_post ON requests(post_id);
//       `);

//       console.log("Requests table created successfully.");
//     } else {
//       console.log("Requests table already exists.");
//     }

//     // Create the login_session table
//     const loginSessionTableExistsQuery = await user.query(
//       "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'login_session')"
//     );

//     const loginSessionTableExists = loginSessionTableExistsQuery.rows[0].exists;

//     if (!loginSessionTableExists) {
//       // Execute the script to create the login_session table
//       await user.query(`
//           CREATE TABLE login_session (
//             session_id SERIAL PRIMARY KEY,
//             user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
//             user_type VARCHAR(255),
//             name VARCHAR(255),
//             surname VARCHAR(255),
//             email VARCHAR(255),
//             login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//           );

//           CREATE INDEX IF NOT EXISTS idx_login_session_user ON login_session(user_id);
//         `);

//       console.log("Login Session table created successfully.");
//     } else {
//       console.log("Login Session table already exists.");
//     }
//   } catch (error) {
//     console.error("Error creating tables:", error);
//   } finally {
//     user.release();
//   }
// };

// // Call the function to create the users, posts, and ratings_comments tables
// createUsersTable();

module.exports = pool;
