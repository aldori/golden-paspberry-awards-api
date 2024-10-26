import { Producer } from "../models/producer.model";
import database from "../config/db";
import {
  IAwardGapProducer,
  IAwardGapYears,
  IProducerAwardsGaps,
} from "src/interfaces/interfaces";

export default class ProducerRepository {
  static async save(name: string): Promise<Producer> {
    const insert = database.prepare("INSERT INTO producers (name) VALUES (?)");

    return new Promise((resolve, reject) => {
      insert.run(name, function (err) {
        if (err) reject(err);
        else resolve(new Producer(this.lastID, name));
      });

      insert.finalize();
    });
  }

  static async findAwardsGaps(): Promise<IProducerAwardsGaps> {
    const query = `
      SELECT 
          p.id_producer, 
          p.name AS producer,
          m.id_movie,
          m.title, 
          m.year
      FROM producers p
      JOIN movie_producer mp ON mp.producer_id = p.id_producer
      JOIN movies m ON m.id_movie = mp.movie_id
      WHERE m.winner = true AND p.id_producer IN (
          SELECT mp2.producer_id
          FROM movie_producer mp2
          JOIN movies m2 ON m2.id_movie = mp2.movie_id
          WHERE m2.winner = true
          GROUP BY mp2.producer_id      
          HAVING COUNT(DISTINCT m2.id_movie) > 1
      )`;

    return new Promise((resolve, reject) => {
      database.all(
        query,
        (
          err: Error | null,
          rows: Array<{
            id_producer: number;
            producer: string;
            id_movie: number;
            title: string;
            year: number;
          }>
        ) => {
          if (err) {
            return reject(err);
          }

          const producers: Record<number, IAwardGapProducer> = {};

          rows.forEach(({ id_producer, producer, id_movie, title, year }) => {
            if (!producers[id_producer]) {
              producers[id_producer] = { id_producer, producer, movies: [] };
            }
            producers[id_producer].movies.push({ id_movie, title, year });
          });

          const producersArray = Object.values(producers);

          const producersInterval = producersArray.map(
            ({ producer, movies }) => {
              const years = movies
                .map((movie) => movie.year)
                .sort((a, b) => a - b);

              let maxInterval = 0;
              let minInterval = Infinity;
              let closestYearsMax: IAwardGapYears = {
                previousWin: null,
                followingWin: null,
              };
              let closestYearsMin: IAwardGapYears = {
                previousWin: null,
                followingWin: null,
              };

              for (let i = 0; i < years.length - 1; i++) {
                const interval = years[i + 1] - years[i];

                if (interval > maxInterval) {
                  maxInterval = interval;
                  closestYearsMax = {
                    previousWin: years[i],
                    followingWin: years[i + 1],
                  };
                }

                if (interval < minInterval) {
                  minInterval = interval;
                  closestYearsMin = {
                    previousWin: years[i],
                    followingWin: years[i + 1],
                  };
                }
              }

              return {
                producer,
                maxInterval,
                minInterval,
                closestYearsMax,
                closestYearsMin,
              };
            }
          );

          const maxInterval = Math.max(
            ...producersInterval.map((item) => item.maxInterval)
          );
          const producersWithMaxInterval = producersInterval.filter(
            (item) => item.maxInterval === maxInterval
          );

          const minInterval = Math.min(
            ...producersInterval.map((item) => item.minInterval)
          );
          const producersWithMinInterval = producersInterval.filter(
            (item) => item.minInterval === minInterval
          );

          const result: IProducerAwardsGaps = {
            min: producersWithMinInterval.map((item) => ({
              producer: item.producer,
              interval: item.minInterval,
              previousWin: item.closestYearsMin.previousWin,
              followingWin: item.closestYearsMin.followingWin,
            })),
            max: producersWithMaxInterval.map((item) => ({
              producer: item.producer,
              interval: item.maxInterval,
              previousWin: item.closestYearsMax.previousWin,
              followingWin: item.closestYearsMax.followingWin,
            })),
          };

          resolve(result);
        }
      );
    });
  }

  static async findAll(): Promise<Producer[]> {
    return new Promise((resolve, reject) => {
      database.all("SELECT * FROM producers", (err, rows: Producer[]) => {
        if (err) {
          reject(err);
        } else {
          const results = rows.map(
            (row) => new Producer(row.id_producer, row.name)
          );
          resolve(results);
        }
      });
    });
  }

  static async findById(id: number): Promise<Producer | null> {
    return new Promise((resolve, reject) => {
      database.get(
        "SELECT * FROM producers WHERE id_producer = ?",
        [id],
        (err, row: Producer) => {
          if (err) {
            reject(err);
          } else if (row) {
            resolve(new Producer(row.id_producer, row.name));
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  static async update(id: number, producer: Producer): Promise<Producer> {
    const updateQuery = "UPDATE producers SET name = ? WHERE id_producer = ?";

    return new Promise((resolve, reject) => {
      const update = database.prepare(updateQuery);
      update.run(producer.name, id, (err: Error) => {
        if (err) reject(err);
        else resolve(producer);
      });

      update.finalize();
    });
  }
}
