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
  },
  admin: {
    type: Boolean,
    default: false
  }
});

// model methods
UserSchema.methods.createdTimestamp = function () {
  this.created = moment().format(process.env.DATE_FORMAT);
};

UserSchema.methods.updatedTimestamp = function () {
  this.updated = moment().format(process.env.DATE_FORMAT);
};

UserSchema.methods.isAdmin = function (email) {
  const adminEmails = process.env.MYEMAILS;
  const aeSplit = adminEmails.split(',');
  console.log('aeSplit', aeSplit);
  this.admin = aeSplit.indexOf(email) >= 0;
};

const User: Model<IUserDocument> = model<IUserDocument>('User', UserSchema);

export default User;