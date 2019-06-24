import { gql } from 'apollo-server-express';

const schema = gql`
type Collectible {
  _id: String
  user: String!
  name: String!
  company: String
  image: String
  type: String
  notes: String
  forPlatforms: [String]
  associatedGame: String
  character: String
  quantity: Int
  pricePaid: Float
  purchaseDate: String
  howAcquired: String
  officialLicensed: Boolean
  wishlist: Boolean
  created: String
  updated: String
}
input CollectibleReq {
  id: String
  name: String!
  company: String
  image: String
  type: String
  notes: String
  forPlatforms: [String]
  associatedGame: String
  character: String
  quantity: Int
  pricePaid: Float
  purchaseDate: String
  howAcquired: String
  officialLicensed: Boolean
  wishlist: Boolean
}
extend type Query {
  userCollectibles(id: String, wl: String): [Collectible]
}
extend type Mutation {
  addCollectible(coll: CollectibleReq!): Collectible
  editCollectible(coll: CollectibleReq): Collectible
  deleteCollectible(id: String): Int
}
`;

export default schema;