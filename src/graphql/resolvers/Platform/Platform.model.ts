import { Document } from 'mongoose';

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
  id?: number;
  igdbId: string;
  userId?: string;
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
  wishlist?: boolean;
  created?: string;
  updated?: string;
}

export interface IPlatformDocument extends Document {
  id?: number;
  igdbId: string;
  userId?: string;
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
  wishlist?: boolean;
  created?: string;
  updated?: string;
  createdTimestamp?: Function;
  updatedTimestamp?: Function;
}

export interface IPlatformReq {
  platform: IPlatformDocument;
}