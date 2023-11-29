import { logIn } from "../controllers/auth";
import express from "express";
const router = express.Router();
router.post("/logIn", logIn);

module.exports = router;
