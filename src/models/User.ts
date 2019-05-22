import { Schema, Model, model } from 'mongoose';
import { IUserDocument } from '../graphql/resolvers/User/User.model';

// Create the User Schema.
const UserSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
    index: true,
    auto: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const User: Model<IUserDocument> = model<IUserDocument>('User', UserSchema);

export default User;