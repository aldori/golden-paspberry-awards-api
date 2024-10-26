import MovieRepository from "../repositories/movie.repository";
import { Movie } from "../models/movie.model";
import database from "../config/db";

describe("MovieRepository", () => {
  beforeAll(async () => {
    await database.exec(`
      CREATE TABLE movies (
        id_movie INTEGER PRIMARY KEY AUTOINCREMENT,
        year INTEGER NOT NULL,
        title TEXT NOT NULL,
        winner BOOLEAN NOT NULL
      )
    `);

    await database.exec(`
      CREATE TABLE studios (
        id_studio INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      )
    `);

    await database.exec(`
      CREATE TABLE producers (
        id_producer INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      )
    `);

    await database.exec(`
      CREATE TABLE movie_studio (
        movie_id INTEGER,
        studio_id INTEGER,
        FOREIGN KEY (movie_id) REFERENCES movies (id_movie),
        FOREIGN KEY (studio_id) REFERENCES studios (id_studio)
      )
    `);

    await database.exec(`
      CREATE TABLE movie_producer (
        movie_id INTEGER,
        producer_id INTEGER,
        FOREIGN KEY (movie_id) REFERENCES movies (id_movie),
        FOREIGN KEY (producer_id) REFERENCES producers (id_producer)
      )
    `);
  });

  afterAll(async () => {
    await database.exec("DROP TABLE movie_producer");
    await database.exec("DROP TABLE movie_studio");
    await database.exec("DROP TABLE movies");
    await database.exec("DROP TABLE studios");
    await database.exec("DROP TABLE producers");
    await database.close();
  });

  it("should save movie", async () => {
    const movie = new Movie(0, 2024, "movie 1", false);

    const savedMovie = await MovieRepository.save(movie);

    expect(savedMovie).toHaveProperty("id_movie");
    expect(savedMovie.title).toBe("movie 1");
  });

  it("should return all movies", async () => {
    await MovieRepository.save(new Movie(0, 2022, "movie2", false));

    const movies = await MovieRepository.findAll();
    expect(movies.length).toBeGreaterThan(0);
    expect(movies[0]).toHaveProperty("id_movie");
    expect(movies[0]).toHaveProperty("title");
  });

  it("should return winners", async () => {
    await MovieRepository.save(new Movie(0, 2021, "winning movie", true));
    await MovieRepository.save(new Movie(0, 2020, "losing movie", false));

    const winners = await MovieRepository.findWinners();
    expect(winners.length).toBe(1);
    expect(winners[0].title).toBe("winning movie");
  });

  it("should return a movie by ID", async () => {
    const movieToSave = await MovieRepository.save(
      new Movie(0, 2009, "movie ID", true)
    );
    const foundMovie = await MovieRepository.findById(movieToSave.id_movie);

    expect(foundMovie).toHaveProperty("id_movie");
    expect(foundMovie?.title).toBe("movie ID");
  });

  it("should return null if the movie does not exist", async () => {
    const foundMovie = await MovieRepository.findById(9999);
    expect(foundMovie).toBeNull();
  });

  it("should update an existing movie", async () => {
    const movieToUpdate = await MovieRepository.save(
      new Movie(0, 2018, "updated movie", false)
    );
    const updatedMovie = new Movie(
      movieToUpdate.id_movie,
      2028,
      "updated movie",
      true
    );

    await MovieRepository.update(movieToUpdate.id_movie, updatedMovie);
    const foundMovie = await MovieRepository.findById(movieToUpdate.id_movie);

    expect(foundMovie?.title).toBe("updated movie");
    expect(foundMovie?.year).toBe(2028);
    expect(foundMovie?.winner).toBe(true);
  });

  it("should associate movie with studios and producers", async () => {
    const studio = { id_studio: 1, name: "studio 1" };
    const producer = { id_producer: 1, name: "producer 1" };

    await database.exec(`INSERT INTO studios (name) VALUES ('${studio.name}')`);
    await database.exec(
      `INSERT INTO producers (name) VALUES ('${producer.name}')`
    );

    const movie = new Movie(
      0,
      2030,
      "movie with studio and producer",
      true,
      [studio],
      [producer]
    );
    const savedMovie = await MovieRepository.save(movie);
    const foundMovie = await MovieRepository.findById(savedMovie.id_movie);
    expect(foundMovie).not.toBeNull();
    if (foundMovie) {
      expect(foundMovie.studios).toHaveLength(1);
      expect(foundMovie.producers).toHaveLength(1);
      if (foundMovie.studios) {
        expect(foundMovie.studios[0].name).toBe("studio 1");
      }
      if (foundMovie.producers) {
        expect(foundMovie.producers[0].name).toBe("producer 1");
      }
    }
  });
});
