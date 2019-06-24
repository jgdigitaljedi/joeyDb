import { Document } from 'mongoose';

interface ICollBasic {
  name: string;
  company?: string;
  image?: string;
  wishlist?: boolean;
  forPlatforms: string[];
  associatedGame: string;
  character: string;
  quantity: number;
  type: string;
  pricePaid: number;
  purchaseDate: string;
  howAcquired: string;
  officialLicensed: boolean;
}

export interface ICollectibleDocument extends Document, ICollBasic {
  user?: string;
  createdTimestamp?: Function;
  updatedTimestamp?: Function;
  created?: string;
  updated?: string;
}