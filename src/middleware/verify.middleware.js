import jwt from "jsonwebtoken";
import User from "../schema/auth.schmea.js";
import { CustomError } from "../utils/responseHelpers.js";

export const verifyTokenMiddleware = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      throw new CustomError(401, "Unauthorized - No Token Provided");
    }
    const token = auth.split(" ")[1];
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      throw new CustomError(404, "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new CustomError(403, "Token invalid"));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new CustomError(403, "Token expired. Please login again"));
    }
    next(error);
  }
};
