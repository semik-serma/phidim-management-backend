import jwt from "jsonwebtoken";
import { registerModel } from "../models/auth.models.js";
import { errorResponse } from "../utils/response.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return errorResponse(res, "Not authorized, no token", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await registerModel.findById(decoded.userId).select("-password");

    if (!user) {
      return errorResponse(res, "User not found", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    return errorResponse(res, "Not authorized, token invalid", 401);
  }
};