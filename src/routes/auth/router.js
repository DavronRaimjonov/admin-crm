import { Router } from "express";
import {
  create_admin,
  create_manager,
  sign_in,
} from "../../controller/auth.controller.js";
import { createAuthMiddleware } from "../../middleware/validator.middleware.js";
import { verifyMenejerMiddleware } from "../../middleware/role.middleware.js";
import { verifyTokenMiddleware } from "../../middleware/verify.middleware.js";

const router = Router();

router.post("/sign-in", sign_in);
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
