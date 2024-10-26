import sqlite3 from "sqlite3";

const database = new sqlite3.Database(":memory:");

export const setupDatabase = () => {
  database.serialize(() => {
    database.run(`
            CREATE TABLE IF NOT EXISTS studios (
                id_studio INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE
            )
        `);
    database.run(`
            CREATE TABLE IF NOT EXISTS producers (
                id_producer INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE
            )
        `);
    database.run(`
            CREATE TABLE IF NOT EXISTS movies (
                id_movie INTEGER PRIMARY KEY AUTOINCREMENT,
                year INTEGER,
                title TEXT,
                winner BOOLEAN
            )
        `);
    database.run(`
            CREATE TABLE IF NOT EXISTS movie_studio (
                id_movie_studio INTEGER PRIMARY KEY AUTOINCREMENT,
                movie_id INTEGER,
                studio_id INTEGER,
                FOREIGN KEY (movie_id) REFERENCES movies(id_movie),  
                FOREIGN KEY (studio_id) REFERENCES studios(id_studio)
              )
          `);
    database.run(`
            CREATE TABLE IF NOT EXISTS movie_producer (
                id_movie_producer INTEGER PRIMARY KEY AUTOINCREMENT,
                movie_id INTEGER,
                producer_id INTEGER,
                FOREIGN KEY (movie_id) REFERENCES movies(id_movie),
                FOREIGN KEY (producer_id) REFERENCES producers(id_producer)
            )
        `);
  });
};

export default database;
