import { Document } from 'mongoose';

export interface ICollectibleDocument extends Document {
  user?: string;
  createdTimestamp?: Function;
  updatedTimestamp?: Function;
  name: string;
  brand?: string;
  image?: string;
  wishlist?: boolean;
  created?: string;
  updated?: string;
}