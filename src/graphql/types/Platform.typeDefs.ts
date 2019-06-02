import { gql } from 'apollo-server-express';

export default gql`
type Platform {
  id: String!
  userId: String
  alternative_name: String
  category: Int
  name: String
}
extend type Query {
  platformLookup(search: String): [Platform]
}
extend type Mutation {
  addPlatform(platform: String): Boolean
}
`;