import { gql } from 'apollo-server-express';

const schema = gql`
type BcList {
  _id: String
  igdbId: Int
  name: String
  notes: [String]
  lastUpdated: String
}
extend type Query {
  tsBcList: [BcList]
  bcList(id: String, wl: String): [BcList]
}
extend type Mutation {
  bcListUpdate: Boolean
}
`;

export default schema;