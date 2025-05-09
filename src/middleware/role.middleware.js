import { CustomError } from "../utils/responseHelpers.js";

export const verifyMenejerMiddleware = (req, res, next) => {
  try {
    const role = req.user.role;
    if (!role) {
      throw new CustomError(403, "Rusxat yo'q");
    }
    if (role !== "manager" && role !== "raxbar") {
      throw new CustomError(403, "Faqat manager yoki raxbarga ruxsat beriladi");
    }

    next();
  } catch (error) {
    next(error);
  }
};
export const verifySeoMiddleware = (req, res, next) => {
  try {
    const role = req.user.role;
    if (!role) {
      throw new CustomError(403, "Rusxat yo'q");
    }
    if (role !== "raxbar") {
      throw new CustomError(
        403,
        "Faqat raxbarga meneger qo'shishga ruxsat beriladi"
      );
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
export const verifyStaffMiddleware = (req, res, next) => {
  try {
    const role = req.user.role;
    if (!role) {
      throw new CustomError(403, "Rusxat yo'q");
    }
    if (role !== "admin" && role !== "manager" && role !== "raxbar") {
      throw new CustomError(403, "Sizga ruxsat yo'q");
    }
    next();
  } catch (error) {
    next(error);
  }
};
