import { Document } from 'mongoose';

export interface IUserDocument extends Document {
  email: string;
  id?: string;
  password: string;
}