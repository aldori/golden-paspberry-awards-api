import { Request, Response, NextFunction } from "express";
import * as movieService from "../services/movie.service";

export const addMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.year) {
      return res.status(400).send({ error: "Year is required." });
    }
    if (!req.body.title) {
      return res.status(400).send({ error: "Title is required." });
    }
    if (!req.body.winner) {
      return res.status(400).send({ error: "Winner is required." });
    }
    if (!req.body.studios) {
      return res.status(400).send({ error: "Studios is required." });
    }
    if (!req.body.producers) {
      return res.status(400).send({ error: "Producers is required." });
    }
    const movie = await movieService.createMovie(req.body);
    res.send(movie);
  } catch (error) {
    next(error);
  }
};

export const listMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const movies = await movieService.getMovies();
    res.send(movies);
  } catch (error) {
    next(error);
  }
};

export const listWinnersMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const movies = await movieService.getWinnerMovies();
    res.send(movies);
  } catch (error) {
    next(error);
  }
};

export const getMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (isNaN(Number(id))) {
      return res
        .status(400)
        .send({ error: "Please ensure the ID is a valid number" });
    }
    const movie = await movieService.getMovieById(Number(id));
    if (movie) {
      res.send(movie);
    } else {
      res.status(404).send({ error: "Movie not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const updateMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (isNaN(Number(id))) {
      return res
        .status(400)
        .send({ error: "Please ensure the ID is a valid number" });
    }
    if (!req.body.year) {
      return res.status(400).send({ error: "Year is required." });
    }
    if (!req.body.title) {
      return res.status(400).send({ error: "Title is required." });
    }
    if (!req.body.winner) {
      return res.status(400).send({ error: "Winner is required." });
    }
    if (!req.body.studios) {
      return res.status(400).send({ error: "Studios is required." });
    }
    if (!req.body.producers) {
      return res.status(400).send({ error: "Producers is required." });
    }
    const updatedMovie = await movieService.updateMovie(Number(id), req.body);
    if (updatedMovie) {
      res.send(updatedMovie);
    } else {
      res.status(404).send({ error: "Movie not found" });
    }
  } catch (error) {
    next(error);
  }
};
