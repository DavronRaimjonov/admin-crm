import { CustomError } from "../utils/responseHelpers.js";
import { createAuthValidator } from "../validator/auth.validator.js";

export const createAuthMiddleware = (req, res, next) => {
  try {
    const { error } = createAuthValidator.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      throw new CustomError(
        400,
        error.details.map((err) => err.message).join(", ")
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};
