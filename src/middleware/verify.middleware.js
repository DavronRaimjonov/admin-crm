import jwt from "jsonwebtoken";
import User from "../schema/auth.schmea.js";
import { CustomError } from "../utils/responseHelpers.js";

export const verifyTokenMiddleware = (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      throw new CustomError(401, "Unauhtorized - Not Token Porivded");
    }
    const token = auth.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, encode) => {
      if (err instanceof jwt.JsonWebTokenError) {
        throw new CustomError(403, "Token invalid");
      }
      if (err instanceof jwt.TokenExpiredError) {
        throw new CustomError(
          403,
          "Token expired. Please login again to get a new token"
        );
      }
      const user = await User.findById(encode.id).select("-password");
      if (!user) {
        throw new CustomError(404, "User not found");
      }
      req.user = user;
      next();
    });
  } catch (error) {
    next(error);
  }
};
