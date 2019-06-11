import { Document } from 'mongoose';

export interface ICloneDocument extends Document {
  name: string;
  user: string;
  createdTimestamp: Function;
  updatedTimestamp: Function;
}