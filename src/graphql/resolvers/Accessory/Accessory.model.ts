import { Document } from 'mongoose';

export interface IAccessoryDocument extends Document {
  name: string;
}