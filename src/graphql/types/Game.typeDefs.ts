import { gql } from 'apollo-server-express';

export default gql`
type Game {
  id: String!
  name: String!
  deck: String
}
type AgeRating {
  id: Int
  rating: Int
}
type AlternativeName {
  id: Int
  name: String!
}
type Cover {
  id: Int
  url: String
}
type IgdbGeneral {
  id: Int
  name: String
}
type IgdbGame {
  id: Int!
  age_ratings: [AgeRating]
  aggregated_rating: Int
  aggregated_rating_count: Int
  alternative_names: [AlternativeName]
  collection: IgdbGeneral
  cover: Cover
  first_release_date: Int
  genres: [IgdbGeneral]
  name: String
  platforms: [IgdbGeneral]
  summary: String
}
extend type Query {
  igdbGameLookup (name: String!, platform: String!): [IgdbGame]
  gbGameLookup (name: String!, platform: String!): [Game]
}
extend type Mutation {
  addGame(name: String!): Boolean
}
`;