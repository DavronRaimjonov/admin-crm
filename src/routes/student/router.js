import { Router } from "express";
import { verifyTokenMiddleware } from "../../middleware/verify.middleware.js";
import { verifyStaffMiddleware } from "../../middleware/role.middleware.js";
import {
  added_new_group_student,
  create_student,
  deleted_student,
  get_all_students,
  get_one_student,
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
router.post(
  "/added-new-group-student",
  verifyStaffMiddleware,
  added_new_group_student
);
router.delete("/delete-student", verifyStaffMiddleware, deleted_student);

router.get("/search-group", verifyStaffMiddleware, search_group);
router.get("/get-all-students", verifyStaffMiddleware, get_all_students);
router.get("/student/:id", verifyStaffMiddleware, get_one_student);
export { router };
