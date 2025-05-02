import { Router } from "express";
import { verifyTokenMiddleware } from "../../middleware/verify.middleware.js";
import {
  create_teacher,
  fire_teacher,
  get_all_teachers,
  get_one_taacher,
  return_teacher_work,
} from "../../controller/teacher.controller.js";
import { verifyStaffMiddleware } from "../../middleware/role.middleware.js";
import { createTeacherMiddleware } from "../../middleware/validator.middleware.js";

const router = Router();
router.use(verifyTokenMiddleware);
router.get("/get-all-teachers", get_all_teachers);
router.get("/get-teacher/:id", get_one_taacher);
router.post(
  "/create-teacher",
  verifyStaffMiddleware,
  createTeacherMiddleware,
  create_teacher
);
router.delete("/fire-teacher", verifyStaffMiddleware, fire_teacher);
router.post("/return-teacher", verifyStaffMiddleware, return_teacher_work);
export { router };
