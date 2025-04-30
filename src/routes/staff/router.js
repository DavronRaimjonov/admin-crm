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
  edited_manager,
  findOneUser,
  getAllAdmins,
  getAllManagers,
  getDeletedWorks,
  leave_exit_staff,
  leave_staff,
} from "../../controller/staff.controller.js";
const router = Router();
router.use(verifyTokenMiddleware);
router.get("/all-managers", getAllManagers);
router.get("/all-admins", getAllAdmins);
router.get("/deleted-staff", getDeletedWorks);
router.get("/info/:id", findOneUser);
router.post(
  "/create-manager",
  createAuthMiddleware,
  verifySeoMiddleware,
  create_manager
);
router.post(
  "/create-admin",
  createAuthMiddleware,
  verifyMenejerMiddleware,
  create_admin
);
router.post(
  "/edited-admin",
  verifyMenejerMiddleware,
  editedAuthMiddleware,
  edited_admin
);
router.post(
  "/edited-manager",
  verifySeoMiddleware,
  editedAuthMiddleware,
  edited_manager
);
router.delete("/deleted-admin", verifyMenejerMiddleware, deleted_admin);
router.post(
  "/leave-staff",
  verifyMenejerMiddleware,
  leaveStaffMiddleware,
  leave_staff
);
router.post("/leave-exit-staff", verifyMenejerMiddleware, leave_exit_staff);

export { router };
