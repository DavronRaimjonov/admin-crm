import { Router } from "express";
import { router as AuthRouter } from "./auth/router.js";
import { router as StaffRouter } from "./staff/router.js";
import { router as TeacherRouter } from "./teacher/router.js";
import { router as GroupRouter } from "./group/router.js";
const router = Router();

router.use("/auth", AuthRouter);
router.use("/staff", StaffRouter);
router.use("/teacher", TeacherRouter);
router.use("/group", GroupRouter);
export { router };
