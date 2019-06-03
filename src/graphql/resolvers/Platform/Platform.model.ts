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

export interface IPlatformDocument extends Document {

}