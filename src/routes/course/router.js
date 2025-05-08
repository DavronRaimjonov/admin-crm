import { Router } from "express";
import { verifyTokenMiddleware } from "../../middleware/verify.middleware.js";
import { verifyMenejerMiddleware } from "../../middleware/role.middleware.js";
import {
  add_category,
  create_course,
  get_courses,
} from "../../controller/course.controller.js";
import { createCourseMiddleware } from "../../middleware/validator.middleware.js";

const router = Router();
router.use(verifyTokenMiddleware);
router.post("/create-category", verifyMenejerMiddleware, add_category);
router.post(
  "/create-courses",
  verifyMenejerMiddleware,
  createCourseMiddleware,
  create_course
);
router.get("/get-courses", get_courses);
export { router };
