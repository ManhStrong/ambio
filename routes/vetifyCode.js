import { vetifyCode } from "../controllers/auth";
import express from "express";
const router = express.Router();
router.post("/verifyCode", vetifyCode);

module.exports = router;
