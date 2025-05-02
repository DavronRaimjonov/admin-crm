import { Router } from "express";
import { verifyTokenMiddleware } from "../../middleware/verify.middleware.js";
import {
  create_group,
  get_all_group,
} from "../../controller/group.controller.js";
import { verifyStaffMiddleware } from "../../middleware/role.middleware.js";
import { createGroupMiddleware } from "../../middleware/validator.middleware.js";

const router = Router();

router.use(verifyTokenMiddleware);
router.post(
  "/create-group",
  verifyStaffMiddleware,
  createGroupMiddleware,
  create_group
);
router.get("/get-all-group", get_all_group);

export { router };
