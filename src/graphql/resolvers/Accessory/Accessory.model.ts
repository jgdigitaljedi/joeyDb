import { Document } from 'mongoose';

export interface IAccessoryDocument extends Document {
  name: string;
  user: string;
  createdTimestamp: Function;
  updatedTimestamp: Function;
}