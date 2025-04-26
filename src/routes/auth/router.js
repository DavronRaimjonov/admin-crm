import { Router } from "express";
import {
  edit_profile,
  edit_profile_img,
  sign_in,
} from "../../controller/auth.controller.js";
import { verifyTokenMiddleware } from "../../middleware/verify.middleware.js";
import { editedProfileMiddlwere } from "../../middleware/validator.middleware.js";
import { upload } from "../../config/multer.js";

const router = Router();

router.post("/sign-in", sign_in);
router.post(
  "/edit-profile",
  verifyTokenMiddleware,
  editedProfileMiddlwere,
  edit_profile
);

router.post(
  "/edit-profile-img",
  verifyTokenMiddleware,
  upload.single("image"),
  edit_profile_img,
);

export { router };
