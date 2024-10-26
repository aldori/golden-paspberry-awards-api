import { Studio } from "../models/studio.model";
import database from "../config/db";

export default class StudioRepository {
  static async save(name: string): Promise<Studio> {
    const insert = database.prepare("INSERT INTO studios (name) VALUES (?)");

    return new Promise((resolve, reject) => {
      insert.run(name, function (err) {
        if (err) reject(err);
        else resolve(new Studio(this.lastID, name));
      });

      insert.finalize();
    });
  }

  static async findAll(): Promise<Studio[]> {
    return new Promise((resolve, reject) => {
      database.all("SELECT * FROM studios", (err, rows: Studio[]) => {
        if (err) {
          reject(err);
        } else {
          const results = rows.map(
            (row) => new Studio(row.id_studio, row.name)
          );
          resolve(results);
        }
      });
    });
  }

  static async findById(id: number): Promise<Studio | null> {
    return new Promise((resolve, reject) => {
      database.get(
        "SELECT * FROM studios WHERE id_studio = ?",
        [id],
        (err, row: Studio) => {
          if (err) {
            reject(err);
          } else if (row) {
            resolve(new Studio(row.id_studio, row.name));
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  static async update(id: number, studio: Studio): Promise<Studio> {
    const updateQuery = "UPDATE studios SET name = ? WHERE id_studio = ?";

    return new Promise((resolve, reject) => {
      const update = database.prepare(updateQuery);
      update.run(studio.name, id, (err: Error) => {
        if (err) reject(err);
        else resolve(studio);
      });

      update.finalize();
    });
  }
}
