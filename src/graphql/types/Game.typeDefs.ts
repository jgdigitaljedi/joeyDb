import { gql } from 'apollo-server-express';

export default gql`
type Game {
  id: String!
  name: String!
  deck: String
}
extend type Query {
  gameLookup (name: String!, platform: String!): [Game]
}
extend type Mutation {
  addGame(name: String!): Boolean
}
`;