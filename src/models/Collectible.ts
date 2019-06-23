import { Schema, Model, model } from 'mongoose';
import { ICollectibleDocument } from '../graphql/resolvers/Collectible/Collectible.model';
import { Helpers } from '../util/helpers';

const CollectibleSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String
  },
  company: {
    type: String,
    default: null
  },
  forPlatforms: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Platform'
    }
  ],
  associatedGame: {
    type: String,
    default: null
  },
  character: {
    type: String,
    default: null
  },
  quantity: {
    type: Number,
    default: 1
  },
  wishlist: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
    default: null
  },
  type: {
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
CollectibleSchema.methods.createdTimestamp = function () {
  this.created = Helpers.getTimestamp();
};

CollectibleSchema.methods.updatedTimestamp = function () {
  this.updated = Helpers.getTimestamp();
};

const Collectible: Model<ICollectibleDocument> = model<ICollectibleDocument>('Collectible', CollectibleSchema);

export default Collectible;