import { Document } from 'mongoose';

interface IGameIgdbData {
  id?: number;
  name: string;
  total_rating?: number;
  total_rating_count?: number;
  developers?: string[];
  genres?: string[];
  first_release_date?: string;
  esrb?: number;
}

interface IGameGbData {
  gbid?: number;
  guid?: string;
  aliases?: string[];
  image?: string;
  deck?: string;
  platforms?: string[];
}

export interface IGameDocument extends Document {
  id?: string;
  igdb?: IGameIgdbData;
  gb?: IGameGbData;
  pricePaid?: number;
  physical?: boolean;
  case: string;
  condition: string;
  cib?: boolean;
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
