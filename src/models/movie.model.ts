import { IMovie } from "../interfaces/interfaces";
import { Studio } from "./studio.model";
import { Producer } from "./producer.model";

export class Movie implements IMovie {
  id_movie: number;
  year: number;
  title: string;
  winner: boolean;
  studios?: Studio[];
  producers?: Producer[];

  constructor(
    id_movie: number,
    year: number,
    title: string,
    winner: boolean,
    studios?: Studio[],
    producers?: Producer[]
  ) {
    this.id_movie = id_movie;
    this.year = year;
    this.title = title;
    this.winner = winner;
    this.studios = studios;
    this.producers = producers;
  }
}
