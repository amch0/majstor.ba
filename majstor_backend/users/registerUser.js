const pool = require("../database");
const nodemailer = require("nodemailer");
const emailConfig = require("../emailConfig");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const generateVerificationToken = () => {
  return Math.random().toString(36).substring(2, 15);
};

const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const transporter = nodemailer.createTransport(emailConfig);

    const mailOptions = {
      from: "elhapvc@gmail.com",
      to: email,
      subject: "User Verification",
      text: `Click the following link to verify your email: http://localhost:8080/users/verify?token=${verificationToken}`,
    };

    await transporter.sendMail(mailOptions);

    return "Verification email sent. Please check your email for further instructions.";
  } catch (error) {
    console.error("Error sending verification email", error);
    throw new Error("Error sending verification email");
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../profilePictures/"));
  },
  filename: (req, file, cb) => {
    const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFileName);
  },
});

const upload = multer({ storage: storage });

const registerUser = async (req, res) => {
  try {
    const { name, type, surname, mail, password, phone_number, location } =
      req.body;

    if (!type || !name || !surname || !mail || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // const hashedPassword = password;

    // Check if email is already used
    const userCheck = await pool.query("SELECT * FROM users WHERE mail = $1", [
      mail,
    ]);

    if (userCheck.rows.length > 0) {
      return res.status(409).json({
        error: "Email is already in use. Please use a different email.",
      });
    }

    const timestamp = new Date().valueOf().toString();
    const uniqueId = `${timestamp}`;
    const verificationToken = generateVerificationToken();

    const user = await pool.connect();

    let profilePicture = null;
    if (req.file) {
      profilePicture = `/profilePictures/${req.file.filename}`;
    }

    const result = await user.query(
      "INSERT INTO users (id, type, name, surname, mail, phone_number, location, password, verified, verification_token, profile_picture) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
      [
        uniqueId,
        type,
        name,
        surname,
        mail,
        phone_number,
        location,
        hashedPassword,
        false,
        verificationToken,
        profilePicture,
      ]
    );

    const newUser = result.rows[0];
    user.release();

    // Send verification email
    const verificationEmailMessage = await sendVerificationEmail(
      mail,
      verificationToken
    );

    res.status(201).json({ ...newUser, verificationEmailMessage });
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { registerUser, upload };
