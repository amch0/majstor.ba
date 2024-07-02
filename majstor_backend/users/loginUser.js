const pool = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const loginUser = async (req, res) => {
  try {
    const { mail, password } = req.body;

    if (!mail || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await pool.connect();
    const result = await user.query("SELECT * FROM users WHERE mail = $1", [
      mail,
    ]);

    if (result.rows.length === 0) {
      user.release();
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const storedPassword = result.rows[0].password;
    const passwordMatch = await bcrypt.compare(password, storedPassword);

    if (!passwordMatch) {
      user.release();
      return res.status(401).json({ error: "Invalid email or password" });
    }
    //if user mail is not veriified, display error
    const isVerified = result.rows[0].verified;
    if (!isVerified) {
      user.release();
      return res.status(403).json({ error: "Email not verified" });
    }

    // User authentication successful, generate a JWT token
    const userId = result.rows[0].id;
    const userType = result.rows[0].type;
    const userName = result.rows[0].name;
    const userSurname = result.rows[0].surname;
    const userEmail = result.rows[0].mail;

    // Save user details to login_session table
    await saveLoginSession(userId, userType, userName, userSurname, userEmail);

    const secretKey = process.env.JWT_SECRET || "default-secret-key";
    const token = jwt.sign({ userId, userType }, secretKey, {
      expiresIn: "24h",
      //   expiresIn: 60,
    });

    user.release();

    //check what is inside the token
    // const decodedToken = jwt.decode(token, { complete: true });
    // // const decodedToken = jwt.verify(token, secretKey);
    // console.log("Decoded Token:", decodedToken);

    res.json({ token });
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).send("Internal Server Error");
  }
};

// Function to save user details to login_session table
const saveLoginSession = async (
  userId,
  userType,
  userName,
  userSurname,
  userEmail
) => {
  const user = await pool.connect();
  try {
    await user.query(
      "INSERT INTO login_session (user_id, user_type, name, surname, email, login_time) VALUES ($1, $2, $3, $4, $5, $6)",
      [userId, userType, userName, userSurname, userEmail, new Date()]
    );
  } catch (error) {
    console.error("Error saving login session:", error);
  } finally {
    user.release();
  }
};

module.exports = { loginUser };
