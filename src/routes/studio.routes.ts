import { Router } from "express";
import {
  addStudio,
  listStudios,
  getStudio,
  updateStudio,
} from "../controllers/studio.controller";

const router = Router();
router.get("/", listStudios);
router.get("/:id", getStudio);
router.post("/", addStudio);
router.put("/:id", updateStudio);

export default router;
