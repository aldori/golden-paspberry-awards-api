import { Router } from "express";
import {
  addProducer,
  listProducers,
  getProducer,
  updateProducer,
  producersAwardsGaps,
} from "../controllers/producer.controller";

const router = Router();

router.post("/", addProducer);
router.get("/", listProducers);
router.get("/awards-gaps", producersAwardsGaps);
router.get("/:id", getProducer);
router.put("/:id", updateProducer);

export default router;
