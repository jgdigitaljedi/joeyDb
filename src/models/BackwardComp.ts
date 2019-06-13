import { Schema, Model, model } from 'mongoose';
import { IBackwardCompDocument } from '../graphql/resolvers/BackwardComp/BackwardComp.model';
import { Helpers } from '../util/helpers';

const BackwardCompSchema = new Schema({
  igdbId: {
    type: Number,
    default: null
  },
  name: {
    type: String
  },
  notes: [{
    type: String,
    default: null
  }],
  lastUpdated: {
    type: String,
    default: null
  }
});

// model methods
BackwardCompSchema.methods.lastUpdatedTimestamp = function () {
  this.lastUpdated = Helpers.getTimestamp();
};

const BackwardComp: Model<IBackwardCompDocument> = model<IBackwardCompDocument>('BackwardComp', BackwardCompSchema);

export default BackwardComp;