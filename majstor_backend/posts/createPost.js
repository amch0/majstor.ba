const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const pool = require("../database");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../workPictures/"));
  },
  filename: (req, file, cb) => {
    const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFileName);
  },
});

const upload = multer({ storage });

const createPost = async (req, res) => {
  try {
    const { userId, userType } = req.user;

    if (userType === "craftsman") {
      const { title, service, content, price } = req.body;

      // Check if files are included in the request
      //   if (!req.files || req.files.length === 0) {
      //     return res
      //       .status(400)
      //       .json({ success: false, message: "No images uploaded" });
      //   }

      const workPictures = req.files.map(
        (file) => `/workPictures/${file.filename}`
      );

      const result = await pool.query(
        "INSERT INTO posts (user_id, title, content, price, work_pictures, service) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [userId, title, content, price, workPictures, service]
      );

      res.status(201).json({ success: true, post: result.rows[0] });
    } else {
      res
        .status(403)
        .json({ success: false, message: "Not authorized to create posts" });
    }
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { createPost, upload };
