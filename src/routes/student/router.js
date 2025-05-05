import { Router } from "express";
import { verifyTokenMiddleware } from "../../middleware/verify.middleware.js";
import { verifyStaffMiddleware } from "../../middleware/role.middleware.js";
import {
  create_student,
  get_all_students,
  search_group,
} from "../../controller/student.controller.js";
import { createStudentMiddleware } from "../../middleware/validator.middleware.js";

const router = Router();

router.use(verifyTokenMiddleware);
router.post(
  "/create-student",
  verifyStaffMiddleware,
  createStudentMiddleware,
  create_student
);

router.get("/search-group", verifyStaffMiddleware, search_group);
router.get("/get-all-students", verifyStaffMiddleware, get_all_students);
export { router };
