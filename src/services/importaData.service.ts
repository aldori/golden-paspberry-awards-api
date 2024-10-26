import fs from "fs";
import fastcsv from "fast-csv";
import path from "path";
import MovieRepository from "src/repositories/movie.repository";
import { Movie } from "src/models/movie.model";
import { getArrayItems } from "src/utils/arrayFormat";
import StudioRepository from "src/repositories/studio.repository";
import { Studio } from "src/models/studio.model";
import { Producer } from "src/models/producer.model";
import ProducerRepository from "src/repositories/producer.repository";

interface IMovieCsv {
  id_movie?: number;
  year: number;
  title: string;
  studios: string;
  producers: string;
  winner: string;
}

const importMoviesFromCSV = async (filePath: string): Promise<IMovieCsv[]> => {
  const movies: IMovieCsv[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(fastcsv.parse({ headers: true, delimiter: ";" }))
      .on("data", (row) => {
        movies.push(row);
      })
      .on("error", (error) => {
        console.error("Error reading CSV file:", error);
        reject(error);
      })
      .on("end", () => {
        resolve(movies);
      });
  });
};

const insertData = async (movies: IMovieCsv[]) => {
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
    const __filename = new URL(import.meta.url).pathname;
    const __dirname = path.dirname(__filename);
    const csvFilePath = path.resolve(__dirname, "../resources/movielist.csv");
    const movies = await importMoviesFromCSV(csvFilePath);
    insertData(movies);
  } catch (error) {
    console.log(error);
  }
};
