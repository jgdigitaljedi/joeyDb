import { gql } from 'apollo-server-express';

export default gql`
type Game {
  id: String!
  name: String!
  platform: String!
}
type Query {
  gameLookup(name: String!, platform: String!): any
}
type Mutation {}
`;