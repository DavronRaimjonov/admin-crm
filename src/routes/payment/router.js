import { Router } from "express";
import { verifyTokenMiddleware } from "../../middleware/verify.middleware.js";
import { verifyStaffMiddleware } from "../../middleware/role.middleware.js";
import {
  create_payment_student,
  get_debtors_student,
} from "../../controller/payment.controller.js";

const router = Router();
router.use(verifyTokenMiddleware);
router.use(verifyStaffMiddleware);
router.post("/payment-student", create_payment_student);
router.get("/get-debtors-student", get_debtors_student);

export { router };
