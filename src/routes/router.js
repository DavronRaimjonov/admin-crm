import { Router } from "express";
import { router as AuthRouter } from "./auth/router.js";
import { router as StaffRouter } from "./staff/router.js";
import { router as TeacherRouter } from "./teacher/router.js";
import { router as GroupRouter } from "./group/router.js";
import { router as StudentRouter } from "./student/router.js";
import { router as PayemntRouter } from "./payment/router.js";
const router = Router();

router.use("/auth", AuthRouter);
router.use("/staff", StaffRouter);
router.use("/teacher", TeacherRouter);
router.use("/group", GroupRouter);
router.use("/student", StudentRouter);
router.use("/payment", PayemntRouter);
export { router };
