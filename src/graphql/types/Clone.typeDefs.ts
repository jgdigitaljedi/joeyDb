import { gql } from 'apollo-server-express';

const schema = gql`
type ClonePlatforms {
  igdbId: Int,
  name: String!
}
type Clone {
  _id: String
  user: String!
  platformsEmulated: [ClonePlatforms]
  name: String!
  company: String
  image: String
  type: String
  notes: String
  pricePaid: String
  purchaseDate: String
  howAcquired: String
  officialLicensed: Boolean
  numberGamesIncluded: Int
  numberGamesAdded: Int
  hacked: Boolean
  wirelessControllers: Boolean
  maxNumberPlayers: Int
  connectedBy: String
  addons: [String]
  hdOutput: Boolean
  upscaler: Boolean
  takesOriginalControllers: Boolean
  wishlist: Boolean
  created: String
  updated: String
}
input ClonePlatformsReq {
  igdbId: Int,
  name: String!
}
input CloneReq {
  id: String
  platformsEmulated: [ClonePlatformsReq]
  name: String!
  company: String
  image: String
  type: String
  notes: String
  pricePaid: String
  purchaseDate: String
  howAcquired: String
  officialLicensed: Boolean
  numberGamesIncluded: Int
  numberGamesAdded: Int
  hacked: Boolean
  wirelessControllers: Boolean
  maxNumberPlayers: Int
  connectedBy: String
  addons: [String]
  hdOutput: Boolean
  upscaler: Boolean
  takesOriginalControllers: Boolean
  wishlist: Boolean
}
extend type Query {
  userClones(id: String, wl: String): [Clone]
}
extend type Mutation {
  addClone(clone: CloneReq!): Clone
  editClone(clone: CloneReq): Clone
  deleteClone(id: String): Int
}
`;

export default schema;