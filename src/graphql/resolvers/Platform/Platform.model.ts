import { Document } from 'mongoose';
import { IAVDeviceDevice } from '../AVDevice/AVDevice.model';

interface IIgdbVersions {
  name: string;
  first_release_date?: string;
  storage: string;
  id?: number;
  platform_version_release_dates?: {
    date: number;
    id: number;
  }[]
  category: string | number;
}

export interface IIgdbPlatformResponse {
  data: IIgdbPlatform[];
}

export interface IIgdbPlatform {
  name: string;
  alternative_name: string;
  category: string;
  igdbId: number;
  generation: number;
  versions: IIgdbVersions[];
  id?: number;
}

export interface IUserPlatform {
  _id?: number;
  igdbId: string;
  user?: string;
  name: string;
  alternative_name?: string;
  category?: string;
  generation?: number;
  versionName?: string;
  first_release_date?: string;
  storage?: string;
  unit?: string;
  mods?: string;
  notes?: string;
  box: boolean;
  connectedBy: string;
  upscaler: boolean;
  condition: string;
  purchasePrice?: number;
  datePurchased?: string;
  howAcquired?: string;
  region?: string;
  ghostConsole: boolean;
  connectionChain?: IAVDeviceDevice[];
  room?: string;
  wishlist?: boolean;
  created?: string;
  updated?: string;
}

export interface IPlatformDocument extends Document {
  igdbId: string;
  user?: string;
  name: string;
  alternative_name?: string;
  category?: string;
  generation?: number;
  versionName?: string;
  first_release_date?: string;
  storage?: string;
  unit?: string;
  mods?: string;
  notes?: string;
  box: boolean;
  connectedBy: string;
  upscaler: boolean;
  condition: string;
  purchasePrice?: number;
  datePurchased?: string;
  howAcquired?: string;
  region?: string;
  ghostConsole: boolean;
  connectionChain?: IAVDeviceDevice[];
  room?: string;
  wishlist?: boolean;
  created?: string;
  updated?: string;
  createdTimestamp?: Function;
  updatedTimestamp?: Function;
}

export interface IPlatformReq {
  platform: IPlatformDocument;
}

export interface IPlatformConnection {
  device: string;
  order: number;
  channel: string;
  input: string;
}

export interface IPlatformCategories {
  id: number;
  name: string;
}