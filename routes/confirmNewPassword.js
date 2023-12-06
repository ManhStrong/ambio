import { confirmNewPassword } from "../controllers/auth";

import express from "express";
const router = express.Router();
router.post("/newPassword", confirmNewPassword);

module.exports = router;
