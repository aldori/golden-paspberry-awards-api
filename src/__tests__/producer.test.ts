import ProducerRepository from '../repositories/producer.repository';
import { Producer } from '../models/producer.model';
import database from '../config/db'; 

describe('Producer Repository', () => {
  beforeAll(async () => {
    await database.exec(`
      CREATE TABLE producers (
        id_producer INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      )
    `);
    
    await database.exec(`
      CREATE TABLE movies (
        id_movie INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        year INTEGER NOT NULL,
        winner BOOLEAN NOT NULL
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
    await database.exec("DROP TABLE movies");
    await database.exec("DROP TABLE producers");
    await database.close();
  });

  it('should saveproducer', async () => {
    const producerName = 'producer 1';
    const producer = await ProducerRepository.save(producerName);

    expect(producer).toHaveProperty('id_producer');
    expect(producer.name).toBe(producerName);
  });

  it('should return all producers', async () => {
    await ProducerRepository.save('producer 2');

    const producers = await ProducerRepository.findAll();
    expect(producers.length).toBeGreaterThan(0);
    expect(producers[0]).toHaveProperty('id_producer');
    expect(producers[0]).toHaveProperty('name');
  });

  it('should return a producer by ID', async () => {
    const producerToSave = await ProducerRepository.save('producer 3');
    const foundProducer = await ProducerRepository.findById(producerToSave.id_producer);
    
    expect(foundProducer).toHaveProperty('id_producer');
    expect(foundProducer?.name).toBe('producer 3');
  });

  it('should give back null if the studio is not found"', async () => {
    const foundProducer = await ProducerRepository.findById(9999);
    expect(foundProducer).toBeNull();
  });

  it('should update an existing producer', async () => {
    const producerToUpdate = await ProducerRepository.save('created producer');
    const updatedProducer = new Producer(producerToUpdate.id_producer, 'updated producer');

    await ProducerRepository.update(producerToUpdate.id_producer, updatedProducer);
    const foundProducer = await ProducerRepository.findById(producerToUpdate.id_producer);
    
    expect(foundProducer?.name).toBe('updated producer');
  });

  it('should calculate awards gaps for producers', async () => {
    const producerWithWins = await ProducerRepository.save('winning producer 1');
    const producerWithoutWins = await ProducerRepository.save('losing producer 1');

    await database.exec(`INSERT INTO movies (title, year, winner) VALUES ('winning producer 2', 2000, true)`);
    await database.exec(`INSERT INTO movies (title, year, winner) VALUES ('winning producer 3', 2005, true)`);
    await database.exec(`INSERT INTO movies (title, year, winner) VALUES ('losing producer 2', 2010, false)`);

    await database.exec(`INSERT INTO movie_producer (movie_id, producer_id) VALUES (1, ${producerWithWins.id_producer})`);
    await database.exec(`INSERT INTO movie_producer (movie_id, producer_id) VALUES (2, ${producerWithWins.id_producer})`);
    await database.exec(`INSERT INTO movie_producer (movie_id, producer_id) VALUES (3, ${producerWithoutWins.id_producer})`);

    const awardGaps = await ProducerRepository.findAwardsGaps();

    expect(awardGaps).toHaveProperty('min');
    expect(awardGaps).toHaveProperty('max');
    expect(awardGaps.min.length).toBe(1);
    expect(awardGaps.max.length).toBe(1);
  });
});
