import { Router } from "express";
import { sign_in } from "../../controller/auth.controller.js";

const router = Router();

router.post("/sign-in", sign_in);

export { router };
