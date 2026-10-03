import express from "express";
import { register, login, getProfile, updateProfile } from "../Controller/auth.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router;

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
