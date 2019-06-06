import { Document } from 'mongoose';

export interface IAVDeviceDocument extends Document {
  userId?: string;
  createdTimestamp?: Function;
  updatedTimestamp?: Function;
  id?: string;
  name: string;
  brand?: string;
  image?: string;
  channels?: string[];
  inputs?: string[];
  output?: string;
  wishlist?: boolean;
  created?: string;
  updated?: string;
}

export interface IAVDeviceReq {
  id?: String;
  name: string;
  brand?: string;
  image?: string;
  channels?: string[];
  inputs?: string[];
  output?: string;
  wishlist?: boolean;
}

export interface IAVDeviceDevice {
  device: IAVDeviceReq;
}