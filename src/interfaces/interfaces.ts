export interface IStudio {
  id_studio: number;
  name: string;
}

export interface IProducer {
  id_producer: number;
  name: string;
}

export interface IMovie {
  id_movie: number;
  year: number;
  title: string;
  winner: boolean;
  studios?: IStudio[];
  producers?: IProducer[];
}

export interface IMovieRow {
  id_movie: number;
  year: number;
  title: string;
  winner: number;
  studio_ids: string | null;
  studio_names: string | null;
  producer_ids: string | null;
  producer_names: string | null;
}

export interface IProducerAwardsGaps {
  min: IAwardGap[];
  max: IAwardGap[];
}

export interface IAwardGap {
  producer: string;
  interval: number;
  previousWin: number | null;
  followingWin: number | null;
}

export interface IAwardGapProducer {
  id_producer: number;
  producer: string;
  movies: IAwardGapMovie[];
}

export interface IAwardGapYears {
  previousWin: number | null;
  followingWin: number | null;
}

interface IAwardGapMovie {
  id_movie: number;
  title: string;
  year: number;
}
