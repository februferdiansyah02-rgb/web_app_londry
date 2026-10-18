import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_default";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token akses diperlukan",
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Token tidak valid atau kadaluarsa",
      });
    }
    req.user = user;
    next();
  });
};
