import express from "express";
import {
  getCommentsByPost,
  postComment,
} from "../controller/commentController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/:postId/postComment", verifyToken, postComment);
router.post("/:postId/getCommentsByPost", getCommentsByPost);

export default router;
