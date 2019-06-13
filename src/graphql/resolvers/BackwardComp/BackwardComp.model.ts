import { Document } from 'mongoose'

export interface IBackwardCompDocument extends Document {
  name: string;
  notes: string[];
  igdbId: number;
  lastUpdated: string;
  lastUpdatedTimestamp?: Function;
}

export interface IBackwardComp {
  _id: string;
  notes: string[];
  igdbId: number;
  lastUpdated: string;
}