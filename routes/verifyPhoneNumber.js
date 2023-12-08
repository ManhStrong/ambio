import { verifyPhoneNumber } from "../controllers/auth";
import express from "express";
const router = express.Router();
router.post("/verifyPhoneNumber", verifyPhoneNumber);

module.exports = router;
