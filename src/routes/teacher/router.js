import { Router } from "express";
import { verifyTokenMiddleware } from "../../middleware/verify.middleware.js";
import { create_teacher } from "../../controller/teacher.controller.js";
import { verifyStaffMiddleware } from "../../middleware/role.middleware.js";
import { createTeacherMiddleware } from "../../middleware/validator.middleware.js";

const router = Router();
router.use(verifyTokenMiddleware);

router.post(
  "/create-teacher",
  verifyStaffMiddleware,
  createTeacherMiddleware,
  create_teacher
);

export { router };
