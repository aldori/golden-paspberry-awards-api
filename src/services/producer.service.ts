import { Producer } from "../models/producer.model";
import ProducerRepository from "../repositories/producer.repository";

export const getAwardsGaps = async () => {
  return await ProducerRepository.findAwardsGaps();
};

export const getProducers = async () => {
  return await ProducerRepository.findAll();
};

export const getProducerById = async (id: number) => {
  return await ProducerRepository.findById(id);
};

export const createProducer = async (name: string) => {
  return await ProducerRepository.save(name);
};

export const updateProducer = async (id: number, producer: Producer) => {
  return await ProducerRepository.update(id, producer);
};
