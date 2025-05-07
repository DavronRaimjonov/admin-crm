import { Router } from "express";
import { verifyTokenMiddleware } from "../../middleware/verify.middleware.js";
import {
  create_group,
  edit_end_group,
  edit_price_group,
  end_group,
  get_all_group,
  get_one_group,
  search_teacher,
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
router.put("/edit-end-group", verifyStaffMiddleware, edit_end_group);
router.put("/edit-price-group", verifyStaffMiddleware, edit_price_group);
router.delete("/end-group", verifyStaffMiddleware, end_group);
router.get("/get-all-group", get_all_group);
router.get("/search-teacher", search_teacher);
router.get("/one-group/:id", get_one_group);

export { router };
