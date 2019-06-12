import { Document } from 'mongoose';

interface IClonePlatforms {
  igdbId: number;
  name: string;
}

interface ICloneBasic {
  platformsEmulated: IClonePlatforms[];
  name: string;
  company: string;
  image: string;
  type: string;
  notes: string;
  pricePaid: string;
  purchaseDate: string;
  howAcquired: string;
  officialLicensed: boolean;
  numberGamesIncluded: number;
  numberGamesAdded: number;
  hacked: boolean;
  wirelessControllers: boolean;
  maxNumberPlayers: number;
  connectedBy: string;
  addons: string[]
  hdOutput: boolean;
  upscaler: boolean;
  takesOriginalControllers: boolean;
  wishlist: boolean;
}

export interface ICloneDocument extends Document, ICloneBasic {
  user: string;
  created: string;
  updated: string;
  createdTimestamp: Function;
  updatedTimestamp: Function;
}

export interface ICloneUser extends ICloneBasic {
  id: string;
  user?: string;
  wishlist: boolean;
  created: string;
  updated: string;
}

export interface ICloneReq {
  clone: ICloneUser;
}