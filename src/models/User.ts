import { Schema, Model, model } from 'mongoose';
import { IUserDocument } from '../graphql/resolvers/User/User.model';
import { Helpers } from '../util/helpers';

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
  },
  admin: {
    type: Boolean,
    default: false
  }
});

// model methods
UserSchema.methods.createdTimestamp = function () {
  this.created = Helpers.getTimestamp();
};

UserSchema.methods.updatedTimestamp = function () {
  this.updated = Helpers.getTimestamp();
};

UserSchema.methods.isAdmin = function (email) {
  const adminEmails = process.env.MYEMAILS;
  const aeSplit = adminEmails.split(',');
  this.admin = aeSplit.indexOf(email) >= 0;
};

const User: Model<IUserDocument> = model<IUserDocument>('User', UserSchema);

export default User;