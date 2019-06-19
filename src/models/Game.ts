import { Schema, Model, model } from 'mongoose';
import { IGameDocument } from '../graphql/resolvers/Game/Game.model';
import { Helpers } from '../util/helpers';

// Create the Game Schema.
const GameSchema = new Schema({
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
  ageRating: {
    type: String,
    default: null
  },
  aggregatedRating: {
    type: Number,
    default: null
  },
  aggregatedRatingCount: {
    type: Number,
    default: null
  },
  alternativeNames: {
    type: [String],
    default: []
  },
  series: {
    type: String,
    default: null
  },
  cover: {
    type: String,
    default: null
  },
  summary: {
    type: String,
    default: null
  },
  platform: {
    type: Schema.Types.ObjectId,
    ref: 'Platform'
  },
  genres: {
    type: [String],
    default: []
  },
  firstReleaseDate: {
    type: String,
    default: null
  },
  pricePaid: {
    type: Number,
    default: null
  },
  physical: {
    type: Boolean,
    default: false
  },
  case: {
    type: String
  },
  condition: {
    type: String
  },
  box: {
    type: Boolean,
    default: false
  },
  manual: {
    type: Boolean,
    default: false
  },
  pirated: {
    type: Boolean,
    default: false
  },
  maxLocalPlayerNumber: {
    type: Number,
    default: null
  },
  datePurchased: {
    type: String,
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
  notes: {
    type: String,
    default: null
  },
  gameBeaten: [
    {
      date: {
        type: String
      },
      comment: {
        type: String
      }
    }
  ],
  xboxOneBkwd: {
    bkwd: {
      type: Boolean,
      default: false
    },
    notes: {
      type: [String],
      default: null
    }
  },
  threeSixtyBkwd: {
    bkwd: {
      type: Boolean,
      default: false
    },
    notes: {
      type: [String],
      default: null
    }
  },
  wishlist: {
    type: Boolean,
    default: false
  },
  created: {
    type: String
  },
  updated: {
    type: String
  }
});

// model methods
GameSchema.methods.createdTimestamp = function () {
  this.created = Helpers.getTimestamp();
};

GameSchema.methods.updatedTimestamp = function () {
  this.updated = Helpers.getTimestamp();
};

const Game: Model<IGameDocument> = model<IGameDocument>('Game', GameSchema);

export default Game;