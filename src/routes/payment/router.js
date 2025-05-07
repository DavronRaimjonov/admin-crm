import { Router } from "express";
import { verifyTokenMiddleware } from "../../middleware/verify.middleware.js";
import { show_payment_student } from "../../controller/payment.controller.js";
import { verifyStaffMiddleware } from "../../middleware/role.middleware.js";

const router = Router();
router.use(verifyTokenMiddleware);

router.post(
  "/show-allprice-student",
  verifyStaffMiddleware,
  show_payment_student
);

export { router };
