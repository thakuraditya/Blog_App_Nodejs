import express from "express";
import { logIn, logOut, signUp } from "../controller/authController.js";

const router = express.Router();

router.post("/register", signUp);
router.post("/login", logIn);
router.get("/logout", logOut);

export default router;
