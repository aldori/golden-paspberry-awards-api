import { IStudio } from "src/interfaces/interfaces";

export class Studio implements IStudio {
  id_studio: number;
  name: string;

  constructor(id_studio: number, name: string) {
    this.id_studio = id_studio;
    this.name = name;
  }
}
