import { Document } from 'mongoose';
import { IUserPlatform } from '../Platform/Platform.model';

interface IAccBasic {
  company: string;
  forPlatforms: IUserPlatform[];
  forClones: any[];
  image: string;
  type: string;
  notes: string;
  pricePaid: number;
  purchaseDate: string;
  howAcquired: string;
  officialLicensed: boolean;
  wishlist: boolean;
  name: string;
  user: string;
}

export interface IAccessoryDocument extends Document, IAccBasic {
  createdTimestamp?: Function;
  updatedTimestamp?: Function;
  created: string;
  updated: string;
}