import { Schema, Model, model } from 'mongoose';
import { IAVDeviceDocument } from '../graphql/resolvers/AVDevice/AVDevice.model';
import { Helpers } from '../util/helpers';

const AVDeviceSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String
  },
  brand: {
    type: String,
    default: null
  },
  image: {
    type: String,
    default: null
  },
  channels: [{
    type: String,
    default: null
  }],
  inputs: [{
    type: String,
    default: null
  }],
  output: {
    type: String,
    default: null
  },
  location: {
    type: String
  },
  wishlist: {
    type: Boolean,
    default: false
  },
  created: {
    type: String,
    default: null
  },
  updated: {
    type: String,
    default: null
  }
});

// model methods
AVDeviceSchema.methods.createdTimestamp = function () {
  this.created = Helpers.getTimestamp();
};

AVDeviceSchema.methods.updatedTimestamp = function () {
  this.updated = Helpers.getTimestamp();
};

// AVDeviceSchema.virtual('id').get(function () {
//   return this._id.toHexString();
// });

const AVDevice: Model<IAVDeviceDocument> = model<IAVDeviceDocument>('AVDevice', AVDeviceSchema);

export default AVDevice;