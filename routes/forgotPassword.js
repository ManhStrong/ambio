import { forgotPassword } from "../controllers/auth";
import express from "express";
const router = express.Router();
router.post("/forgotPassword", forgotPassword);

module.exports = router;
