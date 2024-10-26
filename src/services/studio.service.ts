import { Studio } from "../models/studio.model";
import StudioRepository from "../repositories/studio.repository";

export const getStudios = async () => {
  return await StudioRepository.findAll();
};

export const getStudioById = async (id: number) => {
  return await StudioRepository.findById(id);
};

export const createStudio = async (name: string) => {
  return await StudioRepository.save(name);
};

export const updateStudio = async (id: number, studio: Studio) => {
  return await StudioRepository.update(id, studio);
};
