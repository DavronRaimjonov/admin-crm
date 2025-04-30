import { Router } from "express";
import { verifyTokenMiddleware } from "../../middleware/verify.middleware";
import { create_teacher } from "../../controller/teacher.controller";

const router = Router();
router.use(verifyTokenMiddleware);

router.post("create-teacher", create_teacher);
