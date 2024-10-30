import ProducerRepository from "../repositories/producer.repository";
import { Producer } from "../models/producer.model";
import database, { setupDatabase } from "../config/db";
import {
  importMoviesFromCSV,
  insertData,
} from "../services/importaData.service";
import path from "path";

describe("Producer Repository", () => {
  beforeAll(async () => {
    await setupDatabase();
  });

  afterAll(async () => {
    await database.exec("DROP TABLE movie_producer");
    await database.exec("DROP TABLE movies");
    await database.exec("DROP TABLE producers");
    await database.close();
  });

  it("should saveproducer", async () => {
    const producerName = "producer 1";
    const producer = await ProducerRepository.save(producerName);

    expect(producer).toHaveProperty("id_producer");
    expect(producer.name).toBe(producerName);
  });

  it("should return all producers", async () => {
    await ProducerRepository.save("producer 2");

    const producers = await ProducerRepository.findAll();
    expect(producers.length).toBeGreaterThan(0);
    expect(producers[0]).toHaveProperty("id_producer");
    expect(producers[0]).toHaveProperty("name");
  });

  it("should return a producer by ID", async () => {
    const producerToSave = await ProducerRepository.save("producer 3");
    const foundProducer = await ProducerRepository.findById(
      producerToSave.id_producer
    );

    expect(foundProducer).toHaveProperty("id_producer");
    expect(foundProducer?.name).toBe("producer 3");
  });

  it('should give back null if the studio is not found"', async () => {
    const foundProducer = await ProducerRepository.findById(9999);
    expect(foundProducer).toBeNull();
  });

  it("should update an existing producer", async () => {
    const producerToUpdate = await ProducerRepository.save("created producer");
    const updatedProducer = new Producer(
      producerToUpdate.id_producer,
      "updated producer"
    );

    await ProducerRepository.update(
      producerToUpdate.id_producer,
      updatedProducer
    );
    const foundProducer = await ProducerRepository.findById(
      producerToUpdate.id_producer
    );

    expect(foundProducer?.name).toBe("updated producer");
  });

  it("should calculate awards gaps for producers", async () => {
    const dataCSV = await importMoviesFromCSV(
      path.resolve("src/resources/movielist.csv")
    );
    await insertData(dataCSV)
    const awardGaps = await ProducerRepository.findAwardsGaps();
    expect(awardGaps).toHaveProperty("min");
    expect(awardGaps).toHaveProperty("max");
    expect(awardGaps.min.length).toBe(1);
    expect(awardGaps.max.length).toBe(1);
  });
});
