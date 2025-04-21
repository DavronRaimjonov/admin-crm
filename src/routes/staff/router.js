import { Router } from "express";
import { createAuthMiddleware } from "../../middleware/validator.middleware.js";
import { verifyMenejerMiddleware } from "../../middleware/role.middleware.js";
import { verifyTokenMiddleware } from "../../middleware/verify.middleware.js";
import {
  create_admin,
  create_manager,
} from "../../controller/staff.controller.js";
const router = Router();

router.post(
  "/create-manager",
  verifyTokenMiddleware,
  createAuthMiddleware,
  verifyMenejerMiddleware,
  create_manager
);
router.post(
  "/create-admin",
  verifyTokenMiddleware,
  createAuthMiddleware,
  verifyMenejerMiddleware,
  create_admin
);
export { router };
