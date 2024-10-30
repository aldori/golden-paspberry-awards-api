import fs from "fs";
import { parse } from 'csv-parse';
import path from "path";
import MovieRepository from "../repositories/movie.repository";
import { Movie } from "../models/movie.model";
import { getArrayItems } from "../utils/arrayFormat";
import StudioRepository from "../repositories/studio.repository";
import { Studio } from "../models/studio.model";
import { Producer } from "../models/producer.model";
import ProducerRepository from "../repositories/producer.repository";

interface IMovieCsv {
  id_movie?: number;
  year: number;
  title: string;
  studios: string;
  producers: string;
  winner: string;
}

export const importMoviesFromCSV = async (filePath: string): Promise<IMovieCsv[]> => {
  const movies: IMovieCsv[] = [];

  return new Promise((resolve, reject) => {
    const parser = fs
      .createReadStream(filePath)
      .pipe(parse({ columns: true, delimiter: ';', skip_empty_lines: true }));

    parser.on('data', (row) => {
      movies.push(row);
    });

    parser.on('error', (error) => {
      console.error('Error reading CSV file:', error);
      reject(error);
    });

    parser.on('end', () => {
      resolve(movies);
    });
  });
};

export const insertData = async (movies: IMovieCsv[]) => {
  const studiosSet = new Set<string>();
  const producersSet = new Set<string>();

  for (const movie of movies) {
    getArrayItems(movie.studios).forEach((studio) => studiosSet.add(studio));
    getArrayItems(movie.producers).forEach((producer) =>
      producersSet.add(producer)
    );
  }

  for (const studio of studiosSet) {
    const newStudio = new Studio(0, studio);
    await StudioRepository.save(newStudio.name);
  }

  for (const producer of producersSet) {
    const newProducer = new Producer(0, producer);
    await ProducerRepository.save(newProducer.name);
  }

  const allStudios = await StudioRepository.findAll();
  const allProducers = await ProducerRepository.findAll();

  for (const movie of movies) {
    try {
      const movieStudios: Studio[] = allStudios.filter((studio) =>
        getArrayItems(movie.studios).includes(studio.name)
      );
      const movieProducers: Producer[] = allProducers.filter((producer) =>
        getArrayItems(movie.producers).includes(producer.name)
      );

      const newMovie: Movie = new Movie(
        0,
        movie.year,
        movie.title,
        movie.winner === "yes",
        movieStudios,
        movieProducers
      );
      await MovieRepository.save(newMovie);
    } catch (error) {
      console.log(error);
      throw new Error("Error to save movie!");
    }
  }
};

export const importData = async () => {
  try {
    const csvFilePath = path.resolve("src/resources/movielist.csv");
    const movies = await importMoviesFromCSV(csvFilePath);
    insertData(movies);
  } catch (error) {
    console.log(error);
  }
};
