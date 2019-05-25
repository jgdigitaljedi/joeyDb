import { Schema, Model, model } from 'mongoose';
import { IGameDocument } from '../graphql/resolvers/Game/Game.model';
import moment from 'moment';

// Create the Game Schema.
const GameSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
    index: true,
    auto: true,
    required: true
  },
  igdb: {
    id: {
      type: Number,
      default: 9999
    },
    name: {
      type: String
    },
    total_rating: {
      type: Number,
      default: null
    },
    total_rating_count: {
      type: Number,
      default: null
    },
    developers: {
      type: [String],
      default: []
    },
    genres: {
      type: [String],
      default: []
    },
    first_release_date: {
      type: String,
      default: null
    },
    esrb: {
      type: Number,
      default: null
    }
  },
  gb: {
    gbid: {
      type: Number,
      default: null
    },
    guid: {
      type: String,
      default: null
    },
    aliases: {
      type: [String],
      default: []
    },
    image: {
      type: String,
      default: null
    },
    deck: {
      type: String,
      default: null
    },
    platforms: {
      type: [String],
      default: []
    }
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
  cib: {
    type: Boolean,
    default: false
  },
  pirated: {
    type: Boolean,
    default: false
  },
  multiplayerNumber: {
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
  created: {
    type: String
  },
  updated: {
    type: String
  }
});

// model methods
GameSchema.methods.createdTimestamp = function () {
  this.created = moment().format(process.env.DATE_FORMAT);
};

GameSchema.methods.updatedTimestamp = function () {
  this.updated = moment().format(process.env.DATE_FORMAT);
};

const Game: Model<IGameDocument> = model<IGameDocument>('Game', GameSchema);

export default Game;