import express from "express";
import {
  getAllPost,
  getProfile,
  postBlog,
} from "../controller/postController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllPost);

router.get("/profile", verifyToken, getProfile);

router.post("/add-post", verifyToken, postBlog);

export default router;
