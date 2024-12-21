import { Router } from "express";
import { AuthController } from "../controllers";

const router = Router();

router.post("/sign-up", AuthController.signUp);
router.post("/sign-in", AuthController.signIn);

export default router;