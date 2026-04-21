import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const JWT_SECRET = "your_jwt_secret_here";

export default async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // If no token → just continue (no error)
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(payload.id).select("-password");

    if (!user) {
      return next();
    }

    req.user = user;

    next();

  } catch (error) {
    // Ignore malformed or expired tokens
    next();
  }
}