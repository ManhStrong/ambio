import { register } from "../controllers/auth";
import express from "express";
const router = express.Router();
router.post("/register", register);

module.exports = router;
