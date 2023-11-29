import { logOut } from "../controllers/user";
import express from "express";
const router = express.Router();
router.delete("/logout", logOut);

module.exports = router;
