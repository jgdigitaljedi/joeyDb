import { gql } from 'apollo-server-express';
const { transpileSchema } = require('graphql-s2s').graphqls2s;

const schema = `
input UserPlatformReq {
  igdbId: Int
  name: String!
  alternative_name: String
  category: String
  generation: Int
  versionName: String
  first_release_date: String
  storage: String
  unit: String
  purchasePrice: Float
  mods: [String]
  notes: String
  box: Boolean!
  connectedBy: String!
  upscaler: Boolean!
  condition: String!
  datePurchased: String
  howAcquired: String
  region: String
  ghostConsole: Boolean!
  wishlist: Boolean!
}
input UserPlatformEdit inherits UserPlatformReq {
  id: String!
  box: Boolean
  connectedBy: String
  upscaler: Boolean
  condition: String
  name: String
  ghostConsole: Boolean
  wishlist: Boolean
}
type PlatformVersions {
  id: Int
  name: String
  storage: String
  first_release_date: String
}
type IgdbPlatform {
  igdbId: Int
  userId: String
  alternative_name: String
  category: String
  name: String
  generation: Int
  versions: [PlatformVersions]
}
type UserPlatform {
  id: String
  userId: String
  igdbId: Int
  name: String
  alternative_name: String
  category: String
  generation: Int
  versionName: String
  first_release_date: String
  storage: String
  unit: String
  purchasePrice: Float
  mods: [String]
  notes: String
  box: Boolean
  connectedBy: String
  upscaler: Boolean
  condition: String
  datePurchased: String
  howAcquired: String
  region: String
  ghostConsole: Boolean
  wishlist: Boolean
  created: String
  updated: String
}
type PlatformCategories {
  id: Int!
  name: String!
}
extend type Query {
  platformLookup(name: String): [IgdbPlatform]
  myPlatforms(wl: Boolean): [UserPlatform]
  getPlatformCategories: [PlatformCategories]
}
extend type Mutation {
  addPlatform(platform: UserPlatformReq): UserPlatform
  deletePlatform(id: String): Int
  editPlatform(platform: UserPlatformEdit): UserPlatform
}
`;
const transpiled = transpileSchema(schema);
export default gql(transpiled);