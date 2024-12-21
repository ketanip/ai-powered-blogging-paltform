import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import { BlogsController } from "../controllers";

const router = Router();

router.post("/", authMiddleware, BlogsController.createPost);
router.get("/", BlogsController.getAllPosts);
router.get("/:id", BlogsController.getPost);
router.put("/:id", authMiddleware, BlogsController.updatePosts);
router.delete("/:id", authMiddleware, BlogsController.deletePost);

export default router;