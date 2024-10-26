import sqlite3 from "sqlite3";
import { Movie } from "../models/movie.model";
import database from "../config/db";
import { IMovieRow } from "src/interfaces/interfaces";

export default class MovieRepository {
  static async save(movie: Movie): Promise<Movie> {
    const insert = database.prepare(
      "INSERT INTO movies (year, title, winner) VALUES (?, ?, ?)"
    );

    return new Promise((resolve, reject) => {
      insert.run(
        movie.year,
        movie.title,
        movie.winner,
        async function (this: sqlite3.RunResult, err: Error) {
          if (err) {
            reject(err);
          } else {
            try {
              const newMovieId = this.lastID;
              movie.id_movie = newMovieId;
              if (movie.studios)
                await Promise.all(
                  movie.studios.map((studio) =>
                    MovieRepository.associateMovieWithStudio(
                      movie.id_movie,
                      studio.id_studio
                    )
                  )
                );
              if (movie.producers)
                await Promise.all(
                  movie.producers.map((producer) =>
                    MovieRepository.associateMovieWithProducer(
                      movie.id_movie,
                      producer.id_producer
                    )
                  )
                );
              resolve(movie);
            } catch (addErr) {
              reject(addErr);
            }
          }
        }
      );
      insert.finalize();
    });
  }

  static async findAll(): Promise<Movie[]> {
    return new Promise((resolve, reject) => {
      database.all(
        `
        SELECT m.id_movie, m.year, m.title, m.winner,
               GROUP_CONCAT(DISTINCT s.id_studio) AS studio_ids,
               GROUP_CONCAT(DISTINCT s.name) AS studio_names,
               GROUP_CONCAT(DISTINCT p.id_producer) AS producer_ids,
               GROUP_CONCAT(DISTINCT p.name) AS producer_names
        FROM movies m
        LEFT OUTER JOIN movie_studio fs ON m.id_movie = fs.movie_id
        LEFT OUTER JOIN studios s ON fs.studio_id = s.id_studio
        LEFT OUTER JOIN movie_producer fp ON m.id_movie = fp.movie_id
        LEFT OUTER JOIN producers p ON fp.producer_id = p.id_producer
        GROUP BY m.id_movie`,
        (err, rows: IMovieRow[]) => {
          if (err) {
            reject(err);
          } else {
            const results: Movie[] = rows.map((row) => ({
              id_movie: row.id_movie,
              year: row.year,
              title: row.title,
              winner: row.winner === 1,
              studios: row.studio_ids
                ? row.studio_ids
                    .split(",")
                    .map((id: string, index: number) => ({
                      id_studio: Number(id),
                      name: row.studio_names
                        ? row.studio_names.split(",")[index]
                        : "",
                    }))
                : [],
              producers: row.producer_ids
                ? row.producer_ids
                    .split(",")
                    .map((id: string, index: number) => ({
                      id_producer: Number(id),
                      name: row.producer_names
                        ? row.producer_names.split(",")[index]
                        : "",
                    }))
                : [],
            }));

            resolve(results);
          }
        }
      );
    });
  }

  static async findWinners(): Promise<Movie[]> {
    return new Promise((resolve, reject) => {
      database.all(
        `
        SELECT m.id_movie, m.year, m.title, m.winner,
               GROUP_CONCAT(DISTINCT s.id_studio) AS studio_ids,
               GROUP_CONCAT(DISTINCT s.name) AS studio_names,
               GROUP_CONCAT(DISTINCT p.id_producer) AS producer_ids,
               GROUP_CONCAT(DISTINCT p.name) AS producer_names
        FROM movies m
        LEFT OUTER JOIN movie_studio fs ON m.id_movie = fs.movie_id
        LEFT OUTER JOIN studios s ON fs.studio_id = s.id_studio
        LEFT OUTER JOIN movie_producer fp ON m.id_movie = fp.movie_id
        LEFT OUTER JOIN producers p ON fp.producer_id = p.id_producer
        WHERE m.winner = true
        GROUP BY m.id_movie`,
        (err, rows: IMovieRow[]) => {
          if (err) {
            reject(err);
          } else {
            const results: Movie[] = rows.map((row) => ({
              id_movie: row.id_movie,
              year: row.year,
              title: row.title,
              winner: row.winner === 1,
              studios: row.studio_ids
                ? row.studio_ids
                    .split(",")
                    .map((id: string, index: number) => ({
                      id_studio: Number(id),
                      name: row.studio_names
                        ? row.studio_names.split(",")[index]
                        : "",
                    }))
                : [],
              producers: row.producer_ids
                ? row.producer_ids
                    .split(",")
                    .map((id: string, index: number) => ({
                      id_producer: Number(id),
                      name: row.producer_names
                        ? row.producer_names.split(",")[index]
                        : "",
                    }))
                : [],
            }));

            resolve(results);
          }
        }
      );
    });
  }

  static async findById(id: number): Promise<Movie | null> {
    return new Promise((resolve, reject) => {
      database.get(
        `
        SELECT m.id_movie, m.year, m.title, m.winner,
               GROUP_CONCAT(DISTINCT s.id_studio) AS studio_ids,
               GROUP_CONCAT(DISTINCT s.name) AS studio_names,
               GROUP_CONCAT(DISTINCT p.id_producer) AS producer_ids,
               GROUP_CONCAT(DISTINCT p.name) AS producer_names
        FROM movies m
        LEFT OUTER JOIN movie_studio fs ON m.id_movie = fs.movie_id
        LEFT OUTER JOIN studios s ON fs.studio_id = s.id_studio
        LEFT OUTER JOIN movie_producer fp ON m.id_movie = fp.movie_id
        LEFT OUTER JOIN producers p ON fp.producer_id = p.id_producer
        WHERE m.id_movie = ?
        GROUP BY m.id_movie`,
        [id],
        (err, row: IMovieRow) => {
          if (err) {
            reject(err);
          } else if (!row) {
            resolve(null);
          } else {
            const movie: Movie = {
              id_movie: row.id_movie,
              year: row.year,
              title: row.title,
              winner: row.winner === 1,
              studios: row.studio_ids
                ? row.studio_ids
                    .split(",")
                    .map((id: string, index: number) => ({
                      id_studio: Number(id),
                      name: row.studio_names
                        ? row.studio_names.split(",")[index]
                        : "",
                    }))
                : [],
              producers: row.producer_ids
                ? row.producer_ids
                    .split(",")
                    .map((id: string, index: number) => ({
                      id_producer: Number(id),
                      name: row.producer_names
                        ? row.producer_names.split(",")[index]
                        : "",
                    }))
                : [],
            };

            resolve(movie);
          }
        }
      );
    });
  }

  static async update(id: number, movie: Movie): Promise<Movie> {
    const updateQuery = `
      UPDATE movies 
      SET year = ?, title = ?, winner = ?
      WHERE id_movie = ?
    `;

    return new Promise((resolve, reject) => {
      const update = database.prepare(updateQuery);
      update.run(
        movie.year,
        movie.title,
        movie.winner,
        id,
        async (err: Error) => {
          if (err) {
            return reject(err);
          }

          try {
            await MovieRepository.clearStudios(id);
            await MovieRepository.clearProducers(id);

            if (movie.studios)
              await Promise.all(
                movie.studios.map((studio) =>
                  MovieRepository.associateMovieWithStudio(
                    movie.id_movie,
                    studio.id_studio
                  )
                )
              );
            if (movie.producers)
              await Promise.all(
                movie.producers.map((producer) =>
                  MovieRepository.associateMovieWithProducer(
                    movie.id_movie,
                    producer.id_producer
                  )
                )
              );

            resolve(movie);
          } catch (addErr) {
            reject(addErr);
          }
        }
      );
      update.finalize();
    });
  }

  static async associateMovieWithStudio(
    movieId: number,
    studioId: number
  ): Promise<void> {
    const insert = database.prepare(
      "INSERT INTO movie_studio (movie_id, studio_id) VALUES (?, ?)"
    );
    return new Promise((resolve, reject) => {
      insert.run(movieId, studioId, (err: Error) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
      insert.finalize();
    });
  }

  static async associateMovieWithProducer(
    movieId: number,
    producerId: number
  ): Promise<void> {
    const insert = database.prepare(
      "INSERT INTO movie_producer (movie_id, producer_id) VALUES (?, ?)"
    );
    return new Promise((resolve, reject) => {
      insert.run(movieId, producerId, (err: Error) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
      insert.finalize();
    });
  }

  static async clearStudios(movieId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const deleteQuery = "DELETE FROM movie_studio WHERE movie_id = ?";
      database.run(deleteQuery, [movieId], (err: Error) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static async clearProducers(movieId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const deleteQuery = "DELETE FROM movie_producer WHERE movie_id = ?";
      database.run(deleteQuery, [movieId], (err: Error) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
