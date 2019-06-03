import { Schema, Model, model } from 'mongoose';
import moment from 'moment';
import { IPlatformDocument } from '../graphql/resolvers/Platform/Platform.model';

const PlatformSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
    index: true,
    auto: true,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  igdbId: {
    type: Number,
    default: 9999
  },
  name: {
    type: String
  },
  alternative_name: {
    type: String,
    default: null
  },
  category: {
    type: String,
    default: null
  },
  generation: {
    type: Number,
    default: null
  },
  versionName: {
    type: String,
    default: null,
  },
  first_release_date: {
    type: String,
    default: null
  },
  storage: {
    type: String,
    default: null
  },
  pricePaid: {
    type: Number,
    default: null
  },
  mods: {
    type: [String],
    default: []
  },
  notes: {
    type: String,
    default: null
  },
  box: {
    type: Boolean,
    default: false
  },
  connectedBy: {
    type: String,
    default: null
  },
  upscaler: {
    type: Boolean,
    default: false
  },
  datePurchased: {
    type: String,
    default: null
  },
  region: {
    type: String,
    default: 'US'
  },
  ghostConsole: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: String,
    default: null
  },
  updatedAt: {
    type: String,
    default: null
  }
});

// model methods
PlatformSchema.methods.createdTimestamp = function () {
  this.created = moment().format(process.env.DATE_FORMAT);
};

PlatformSchema.methods.updatedTimestamp = function () {
  this.updated = moment().format(process.env.DATE_FORMAT);
};

const Platform: Model<IPlatformDocument> = model<IPlatformDocument>('Platform', PlatformSchema);

export default Platform;