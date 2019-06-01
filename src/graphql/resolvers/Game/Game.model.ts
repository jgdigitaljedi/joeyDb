import { Document } from 'mongoose';

interface IIgdbAgeRatings {
  id: number;
  rating: number;
  translated?: string;
}

interface IIgdbGeneral {
  id: number;
  name?: string;
  url?: string;
}

export interface IGameIgdbData {
  id: number;
  age_ratings: IIgdbAgeRatings[];
  name: string;
  aggregated_rating: number;
  aggregated_rating_count: number;
  alternative_names: IIgdbGeneral[];
  collection: IIgdbGeneral;
  cover: IIgdbGeneral;
  first_release_date: number;
  genres: IIgdbGeneral[];
  platforms: IIgdbGeneral[];
  summary: string;
}

export interface IGameGbData {
  gbid?: number;
  guid?: string;
  aliases?: string[];
  image?: string;
  deck?: string;
  platforms?: string[];
}

export interface IGameIgdbResponse {
  data: IGameIgdbData[];
}

export interface IGameDocument extends Document {
  id?: string;
  userId?: string;
  name: string;
  ageRating?: string;
  aggregatedRating?: number;
  aggregatedRatingCount?: number;
  alternativeNames?: string[];
  series?: string;
  cover?: string;
  summary?: string;
  platforms?: IIgdbGeneral[];
  genres?: string[];
  firstReleaseDate?: string;
  pricePaid?: number;
  physical?: boolean;
  case: string;
  condition: string;
  box?: boolean;
  manual?: boolean;
  pirated?: boolean;
  multiplayerNumber?: number;
  datePurchased?: string;
  howAcquired?: string;
  region?: string;
  createdTimestamp?: Function;
  updatedTimestamp?: Function;
  updated?: string;
  created?: string;
}
