import { CustomError } from "../utils/responseHelpers.js";
import {
  createAuthValidator,
  editAuthValidator,
  editProfileValidator,
  leaveStaffValidator,
} from "../validator/auth.validator.js";

export const validateMiddleware = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  console.log("Validating:", req.body);
  if (error) {
    return next(
      new CustomError(400, error.details.map((err) => err.message).join(", "))
    );
  }

  next();
};
export const createAuthMiddleware = validateMiddleware(createAuthValidator);
export const editedAuthMiddleware = validateMiddleware(editAuthValidator);
export const editedProfileMiddlwere = validateMiddleware(editProfileValidator);
export const leaveStaffMiddleware = validateMiddleware(leaveStaffValidator);
