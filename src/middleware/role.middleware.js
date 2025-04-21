import { CustomError } from "../utils/responseHelpers.js";

export const verifyMenejerMiddleware = (req, res, next) => {
  try {
    const role = req.user.role;
    console.log(role);
    if (!role) {
      throw new CustomError(403, "Rusxat yo'q");
    }
    if (role !== "manager") {
      throw new CustomError(403, "Faqat manager admin yaratishi mumkin");
    }

    next();
  } catch (error) {
    next(error);
  }
};
export const verifyAdminMiddleware = (req, res, next) => {
  try {
    const role = req.user.role;
    if (!role) {
      throw new CustomError(403, "Rusxat yo'q");
    }
    if (role !== "admin") {
      throw new CustomError(403, "Sizga ruxsat yo'q");
    }
    next();
  } catch (error) {
    next(error);
  }
};
