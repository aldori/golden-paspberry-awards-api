import { Router } from "express";
import {
  addMovie,
  listMovies,
  listWinnersMovies,
  getMovie,
  updateMovie,
} from "../controllers/movie.controller";

const router = Router();

router.post("/", addMovie);
router.get("/", listMovies);
router.get("/winners", listWinnersMovies);
router.get("/:id", getMovie);
router.put("/:id", updateMovie);

export default router;
