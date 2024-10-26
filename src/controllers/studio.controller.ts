import { Request, Response, NextFunction } from "express";
import * as studioService from "../services/studio.service";

export const addStudio = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.name) {
      return res.status(400).send({ error: "Name is required." });
    }
    const studio = await studioService.createStudio(req.body.name);
    res.send(studio);
  } catch (error) {
    next(error);
  }
};

export const listStudios = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const studios = await studioService.getStudios();
    res.send(studios);
  } catch (error) {
    next(error);
  }
};

export const getStudio = async (
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
    const studio = await studioService.getStudioById(Number(id));
    if (studio) {
      res.send(studio);
    } else {
      res.status(404).send({ error: "Studio not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const updateStudio = async (
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
    if (!req.body.name) {
      return res.status(400).send({ error: "Name is required." });
    }
    const updatedStudio = await studioService.updateStudio(Number(id), {
      id_studio: Number(id),
      name: req.body.name,
    });
    if (updatedStudio) {
      res.send(updatedStudio);
    } else {
      res.status(404).send({ error: "Studio not found" });
    }
  } catch (error) {
    next(error);
  }
};
