import { Router } from "express";
import { verifyTokenMiddleware } from "../../middleware/verify.middleware.js";
import { verifyMenejerMiddleware } from "../../middleware/role.middleware.js";
import {
  add_category,
  create_course,
  delete_course,
  edit_course,
  freeze_course,
  get_courses,
  unfreeze_course,
} from "../../controller/course.controller.js";
import { createCourseMiddleware } from "../../middleware/validator.middleware.js";

const router = Router();
router.use(verifyTokenMiddleware);
router.post("/create-category", verifyMenejerMiddleware, add_category);
router.post(
  "/create-course",
  verifyMenejerMiddleware,
  createCourseMiddleware,
  create_course
);
router.post("/edit-course", verifyMenejerMiddleware, edit_course);
router.put("/freeze-course", verifyMenejerMiddleware, freeze_course);
router.put("/unfreeze-course", verifyMenejerMiddleware, unfreeze_course);
router.delete("/delete-course", verifyMenejerMiddleware, delete_course);
router.get("/get-courses", get_courses);
export { router };
