require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const requireRole = (role) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err || !role.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied" });
      }
      next();
    });
  };
};
