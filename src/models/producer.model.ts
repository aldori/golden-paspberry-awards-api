import { IProducer } from "src/interfaces/interfaces";

export class Producer implements IProducer {
  id_producer: number;
  name: string;

  constructor(id_producer: number, name: string) {
    this.id_producer = id_producer;
    this.name = name;
  }
}
