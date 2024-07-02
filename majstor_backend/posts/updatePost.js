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

const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, userType } = req.user;
    const { title, service, content, price, removedPictures } = req.body;

    // Check if the user is authorized to update the post
    const postResult = await pool.query(
      "SELECT user_id, work_pictures FROM posts WHERE post_id = $1",
      [postId]
    );

    if (postResult.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const postUserId = postResult.rows[0].user_id;
    const postWorkPictures = postResult.rows[0].work_pictures;

    if (userType === "craftsman" && userId === postUserId) {
      // User is authorized, proceed with updating the post
      let updatedWorkPictures = [...postWorkPictures];

      // Check if new files are included in the request
      if (req.files && req.files.length > 0) {
        const newWorkPictures = req.files.map(
          (file) => `/workPictures/${file.filename}`
        );
        updatedWorkPictures = updatedWorkPictures.concat(newWorkPictures);
      }

      // Check if removedPictures is provided
      if (removedPictures && removedPictures.length > 0) {
        updatedWorkPictures = updatedWorkPictures.filter(
          (picture) => !removedPictures.includes(picture)
        );
      }

      // Update the post with the new images
      const result = await pool.query(
        "UPDATE posts SET title = $1, service = $2, content = $3, price = $4, work_pictures = $5 WHERE post_id = $6 RETURNING *",
        [title, service, content, price, updatedWorkPictures, postId]
      );

      res.json({ success: true, post: result.rows[0] });
    } else {
      res.status(403).json({
        success: false,
        message: "Not authorized to update this post",
      });
    }
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { updatePost, upload };
