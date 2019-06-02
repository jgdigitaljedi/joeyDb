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