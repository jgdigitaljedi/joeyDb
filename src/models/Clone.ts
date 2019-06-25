import { Schema, Model, model } from 'mongoose';
import { ICloneDocument } from '../graphql/resolvers/Clone/Clone.model';
import { Helpers } from '../util/helpers';

const CloneSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  platformsEmulated: [
    {
      igdbId: {
        type: Number
      },
      name: {
        type: String
      }
    }
  ],
  name: {
    type: String,
    required: true
  },
  company: {
    type: String,
    default: null
  },
  image: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    default: null
  },
  pricePaid: {
    type: Number,
    default: null
  },
  purchaseDate: {
    type: String,
    default: null
  },
  howAcquired: {
    type: String,
    default: null
  },
  officialLicensed: {
    type: Boolean,
    default: false
  },
  numberGamesIncluded: {
    type: Number,
    default: 0
  },
  numberGamesAdded: {
    type: Number,
    default: 0
  },
  hacked: {
    type: Boolean,
    default: null
  },
  wirelessControllers: {
    type: Boolean,
    default: false
  },
  maxNumberPlayers: {
    type: Number,
    default: 2
  },
  connectedBy: {
    type: String,
    default: 'HDMI'
  },
  addons: {
    type: [String],
    default: null
  },
  hdOutput: {
    type: Boolean,
    default: true
  },
  upscaler: {
    type: Boolean,
    default: false
  },
  takesOriginalControllers: {
    type: Boolean,
    default: false
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
CloneSchema.methods.createdTimestamp = function () {
  this.created = Helpers.getTimestamp();
};

CloneSchema.methods.updatedTimestamp = function () {
  this.updated = Helpers.getTimestamp();
};

const Clone: Model<ICloneDocument> = model<ICloneDocument>('Clone', CloneSchema);

export default Clone;