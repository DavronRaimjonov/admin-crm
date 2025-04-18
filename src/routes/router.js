import { Router } from "express";
import { router as AuthRouter } from "./auth/router.js";
const router = Router();

router.use("/auth", AuthRouter);
export { router };
