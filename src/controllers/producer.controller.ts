import { Request, Response, NextFunction } from "express";
import * as producerService from "../services/producer.service";

export const addProducer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.name) {
      return res.status(400).send({ error: "Name is required." });
    }
    const producer = await producerService.createProducer(req.body.name);
    res.send(producer);
  } catch (error) {
    next(error);
  }
};

export const listProducers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const producers = await producerService.getProducers();
    res.send(producers);
  } catch (error) {
    next(error);
  }
};

export const getProducer = async (
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
    const producer = await producerService.getProducerById(Number(id));
    if (producer) {
      res.send(producer);
    } else {
      res.status(404).send({ error: "Producer not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const producersAwardsGaps = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const producers = await producerService.getAwardsGaps();
    res.send(producers);
  } catch (error) {
    next(error);
  }
};

export const updateProducer = async (
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
    const updatedProducer = await producerService.updateProducer(Number(id), {
      id_producer: Number(id),
      name: req.body.name,
    });
    if (updatedProducer) {
      res.send(updatedProducer);
    } else {
      res.status(404).send({ error: "Producer not found" });
    }
  } catch (error) {
    next(error);
  }
};
