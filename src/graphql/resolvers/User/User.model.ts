import { Document } from 'mongoose';

export interface IUserDocument extends Document {
  email: string;
  password: string;
  name?: string;
  createdTimestamp?: Function;
  updatedTimestamp?: Function;
  isAdmin?: Function;
  updated?: string;
  created?: string;
  admin?: boolean;
}

export interface IUser {
  name?: string;
  _id?: string;
  email: string;
  password?: string;
  created?: string;
  updated?: string;
  admin?: boolean;
}