const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - Token not provided" });
  }

  try {
    const secretKey = process.env.JWT_SECRET || "default-secret-key";
    const decoded = await promisify(jwt.verify)(token, secretKey);

    //token expired
    if (decoded.exp <= Date.now() / 1000) {
      return res
        .status(401)
        .json({ error: "Unauthorized - Token has expired" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

module.exports = verifyToken;
