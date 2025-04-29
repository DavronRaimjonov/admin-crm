import { Router } from "express";
import {
  createAuthMiddleware,
  editedAuthMiddleware,
  leaveStaffMiddleware,
} from "../../middleware/validator.middleware.js";
import {
  verifyMenejerMiddleware,
  verifySeoMiddleware,
} from "../../middleware/role.middleware.js";
import { verifyTokenMiddleware } from "../../middleware/verify.middleware.js";
import {
  create_admin,
  create_manager,
  deleted_admin,
  edited_admin,
  getAllAdmins,
  getAllManagers,
  getDeletedWorks,
  leave_exit_staff,
  leave_staff,
} from "../../controller/staff.controller.js";
const router = Router();

router.post(
  "/create-manager",
  verifyTokenMiddleware,
  createAuthMiddleware,
  verifySeoMiddleware,
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
  verifyMenejerMiddleware,
  leaveStaffMiddleware,
  leave_staff
);
router.post(
  "/leave-exit-staff",
  verifyTokenMiddleware,
  verifyMenejerMiddleware,
  leave_exit_staff
);
router.get("/all-managers", verifyTokenMiddleware, getAllManagers);
router.get("/all-admins", verifyTokenMiddleware, getAllAdmins);
router.get("/deleted-staff", verifyTokenMiddleware, getDeletedWorks);
export { router };
