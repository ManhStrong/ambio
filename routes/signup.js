import {
  signUp,
} from "../controllers/auth";

import express from "express";
const router = express.Router();
router.post("/signUp", signUp);

module.exports = router;
