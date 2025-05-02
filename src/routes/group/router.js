import { Router } from "express";
import { verifyTokenMiddleware } from "../../middleware/verify.middleware.js";
import { create_group } from "../../controller/group.controller.js";
import { verifyStaffMiddleware } from "../../middleware/role.middleware.js";

const router = Router();

router.use(verifyTokenMiddleware);
router.post("/create-group", verifyStaffMiddleware, create_group);




export { router };
