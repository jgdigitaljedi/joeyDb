import { Schema, Model, model } from 'mongoose';
import { IPlatformDocument } from '../graphql/resolvers/Platform/Platform.model';
import { Helpers } from '../util/helpers';

const PlatformSchema = new Schema({
  user: {
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
  unit: {
    type: String,
    default: null
  },
  mods: {
    type: [String],
    default: null
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
  condition: {
    type: String,
    default: 'Fair'
  },
  datePurchased: {
    type: String,
    default: null
  },
  purchasePrice: {
    type: Number,
    default: null
  },
  howAcquired: {
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
  wishlist: {
    type: Boolean,
    default: false
  },
  connectionChain: [{
    device: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'AVDevice'
    },
    order: {
      type: Number
    },
    usesChannel: {
      type: String
    },
    usesInput: {
      type: String
    }
  }],
  room: {
    type: String,
    default: null
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
PlatformSchema.methods.createdTimestamp = function () {
  this.created = Helpers.getTimestamp();
};

PlatformSchema.methods.updatedTimestamp = function () {
  this.updated = Helpers.getTimestamp();
};

const Platform: Model<IPlatformDocument> = model<IPlatformDocument>('Platform', PlatformSchema);

export default Platform;