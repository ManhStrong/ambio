import { getUserCurrent } from "../controllers/user";
import vetifyToken from "./../middlewares/vetify-token";
import express from "express";
const router = express.Router();
router.use(vetifyToken);
router.get("/", getUserCurrent);

module.exports = router;
