import { Router } from "express";
import {
  createAuthMiddleware,
  editedAuthMiddleware,
  leaveStaffMiddleware,
} from "../../middleware/validator.middleware.js";
import { verifyMenejerMiddleware } from "../../middleware/role.middleware.js";
import { verifyTokenMiddleware } from "../../middleware/verify.middleware.js";
import {
  create_admin,
  create_manager,
  deleted_admin,
  edited_admin,
  getAllAdmins,
  getAllManagers,
  getDeletedWorks,
  leave_staff,
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
router.post(
  "/edited-admin",
  verifyTokenMiddleware,
  verifyMenejerMiddleware,
  editedAuthMiddleware,
  edited_admin
);
router.delete(
  "/deleted-admin",
  verifyTokenMiddleware,
  verifyMenejerMiddleware,
  deleted_admin
);
router.post(
  "/leave-staff",
  verifyTokenMiddleware,
  leaveStaffMiddleware,
  leave_staff
);
router.get("/all-managers", verifyTokenMiddleware, getAllManagers);
router.get("/all-admins", verifyTokenMiddleware, getAllAdmins);
router.get("/deleted-staff", verifyTokenMiddleware, getDeletedWorks);
export { router };
