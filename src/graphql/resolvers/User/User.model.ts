import { Document } from 'mongoose';

export interface IUserDocument extends Document {
  email: string;
  id?: string;
  password: string;
  name?: string;
  createdTimestamp?: Function;
  updatedTimestamp?: Function;
  updated?: string;
  created?: string;
}

export interface IUser {
  name?: string;
  id?: string;
  email: string;
  password?: string;
  created?: string;
  updated?: string;

}