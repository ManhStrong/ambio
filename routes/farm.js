import { getFarmsByUser } from "../controllers/farm";
import vetifyToken from "./../middlewares/vetify-token";
import express from "express";
const router = express.Router();
router.use(vetifyToken);
router.get("/", getFarmsByUser);

module.exports = router;
