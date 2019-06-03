import { gql } from 'apollo-server-express';

export default gql`
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
extend type Query {
  platformLookup(name: String): [IgdbPlatform]
}
extend type Mutation {
  addPlatform(platform: String): Boolean
}
`;