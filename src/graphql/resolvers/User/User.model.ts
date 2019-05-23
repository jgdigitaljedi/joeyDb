import { Document } from 'mongoose';

export interface IUserDocument extends Document {
  email: string;
  id?: string;
  password: string;
}

export interface IUser {
  name?: string;
  id?: string;
  email: string;
  password?: string;
}