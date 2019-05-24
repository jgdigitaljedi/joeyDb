import { Schema, Model, model } from 'mongoose';
import { IUserDocument } from '../graphql/resolvers/User/User.model';
import moment from 'moment';

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
  },
  created: {
    type: String
  },
  updated: {
    type: String
  }
});

// model methods
UserSchema.methods.createdTimestamp = function () {
  this.created = moment().format(process.env.DATE_FORMAT);
};

UserSchema.methods.updatedTimestamp = function () {
  this.updated = moment().format(process.env.DATE_FORMAT);
};

const User: Model<IUserDocument> = model<IUserDocument>('User', UserSchema);

export default User;