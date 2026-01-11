import express from "express";
import { getSeasonalRecommendation } from "../controllers/ai.controller.js";

const router = express.Router();

router.get("/seasonal-recommendation", getSeasonalRecommendation);

export default router;
