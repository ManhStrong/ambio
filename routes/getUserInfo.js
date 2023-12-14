import { getUserInfo } from "../controllers/auth";
import express from "express";
const router = express.Router();
router.get("/getUserInfo", getUserInfo);

module.exports = router;
