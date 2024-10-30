import StudioRepository from "../repositories/studio.repository";
import { Studio } from "../models/studio.model";
import database, { setupDatabase } from "../config/db";

describe("Studio Repository", () => {
  beforeAll(async () => await setupDatabase());

  afterAll(async () => {
    await database.exec("DROP TABLE movie_producer");
    await database.exec("DROP TABLE movie_studio");
    await database.exec("DROP TABLE movies");
    await database.exec("DROP TABLE studios");
    await database.exec("DROP TABLE producers");
    await database.close();
  });

  it("should save studio", async () => {
    const studioName = "studio 1";
    const studio = await StudioRepository.save(studioName);

    expect(studio).toHaveProperty("id_studio");
    expect(studio.name).toBe(studioName);
  });

  it("should return all studios", async () => {
    await StudioRepository.save("studio 2");

    const studios = await StudioRepository.findAll();
    expect(studios.length).toBeGreaterThan(0);
    expect(studios[0]).toHaveProperty("id_studio");
    expect(studios[0]).toHaveProperty("name");
  });

  it("should return a studio by ID", async () => {
    const studioToSave = await StudioRepository.save("studio 3");
    const foundStudio = await StudioRepository.findById(studioToSave.id_studio);

    expect(foundStudio).toHaveProperty("id_studio");
    expect(foundStudio?.name).toBe("studio 3");
  });

  it("should give back null if the studio is not found", async () => {
    const foundStudio = await StudioRepository.findById(9999);
    expect(foundStudio).toBeNull();
  });

  it("should update an existing studio", async () => {
    const studioToUpdate = await StudioRepository.save("created studio");
    const updatedStudio = new Studio(
      studioToUpdate.id_studio,
      "updated studio"
    );

    await StudioRepository.update(studioToUpdate.id_studio, updatedStudio);
    const foundStudio = await StudioRepository.findById(
      studioToUpdate.id_studio
    );

    expect(foundStudio?.name).toBe("updated studio");
  });
});
