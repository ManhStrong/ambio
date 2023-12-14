import { getUserInfo } from "../controllers/auth";
import express from "express";
const router = express.Router();
router.post("/getUserInfo", getUserInfo);

module.exports = router;
