const pool = require("../database");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../profilePictures/"));
  },
  filename: (req, file, cb) => {
    const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFileName);
  },
});

const uploadUpdate = multer({ storage: storage });

const updateUser = async (req, res) => {
  try {
    const { userId, userType } = req.user;
    const { name, surname, mail, phone_number, location } = req.body;

    const user = await pool.connect();

    const checkUserResult = await user.query(
      "SELECT * FROM users WHERE id = $1",
      [userId]
    );

    if (checkUserResult.rows.length === 0) {
      user.release();
      return res.status(404).json({ error: "User not found" });
    }

    // Define allowed fields based on user type
    let allowedFields;
    if (userType === "client") {
      allowedFields = ["name", "surname", "mail", "phone_number", "location"];
    } else if (userType === "craftsman") {
      allowedFields = ["name", "surname", "mail", "phone_number", "location"];
    } else {
      return res.status(400).json({ error: "Invalid user type" });
    }

    // Check if the update fields are allowed for the user type
    const invalidFields = Object.keys(req.body).filter(
      (field) => !allowedFields.includes(field)
    );
    if (invalidFields.length > 0) {
      return res.status(400).json({
        error: `Invalid fields for user type: ${invalidFields.join(", ")}`,
      });
    }

    if (req.file) {
      const profilePicturePath = `/profilePictures/${req.file.filename}`;

      const updateProfileResult = await user.query(
        "UPDATE users SET " +
          allowedFields
            .map((field, index) => `${field} = $${index + 1}`)
            .join(", ") +
          ", profile_picture = $" +
          (allowedFields.length + 1) +
          " WHERE id = $" +
          (allowedFields.length + 2) +
          " RETURNING *",
        allowedFields
          .map((field) => req.body[field])
          .concat(profilePicturePath, userId)
      );

      const updatedUserWithProfile = updateProfileResult.rows[0];
      user.release();

      res.status(200).json(updatedUserWithProfile);
    } else {
      // If no profile_picture provided, update other fields only
      const result = await user.query(
        "UPDATE users SET " +
          allowedFields
            .map((field, index) => `${field} = $${index + 1}`)
            .join(", ") +
          " WHERE id = $" +
          (allowedFields.length + 1) +
          " RETURNING *",
        allowedFields.map((field) => req.body[field]).concat(userId)
      );

      const updatedUser = result.rows[0];
      user.release();

      res.status(200).json(updatedUser);
    }
  } catch (err) {
    console.error("Error executing update query", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { updateUser, uploadUpdate };
