import { Movie } from "../models/movie.model";
import MovieRepository from "../repositories/movie.repository";

export const getMovies = async () => {
  return await MovieRepository.findAll();
};

export const getWinnerMovies = async () => {
  return await MovieRepository.findWinners();
};

export const getMovieById = async (id: number) => {
  return await MovieRepository.findById(id);
};

export const createMovie = async (movie: Movie) => {
  return await MovieRepository.save(movie);
};

export const updateMovie = async (id: number, movie: Movie) => {
  return await MovieRepository.update(id, movie);
};
