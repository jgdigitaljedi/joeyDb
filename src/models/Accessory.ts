import { Schema, Model, model } from 'mongoose';
import { IAccessoryDocument } from '../graphql/resolvers/Accessory/Accessory.model';
import { Helpers } from '../util/helpers';

const AccessorySchema = new Schema({
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
  forClones: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Clone'
    }
  ],
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
AccessorySchema.methods.createdTimestamp = function () {
  this.created = Helpers.getTimestamp();
};

AccessorySchema.methods.updatedTimestamp = function () {
  this.updated = Helpers.getTimestamp();
};

const Accessory: Model<IAccessoryDocument> = model<IAccessoryDocument>('Accessory', AccessorySchema);

export default Accessory;