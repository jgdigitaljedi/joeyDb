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
type GbImage {
  icon_url: String
  medium_url: String
  screen_url: String
  screen_large_url: String
  super_url: String
  thumb_url: String
  tiny_url: String
  original_url: String
  image_tags: String
}
type GbRating {
  api_detail_url: String
  id: Int
  name: String
}
type GbPlatform {
  api_detail_url: String
  id: Int
  name: String
  site_detail_url: String
  abbreviation: String
}
type GbImageTags {
  api_detail_url: String
  name: String
  total: Int
}
type GbGame {
  aliases: [String]
  api_detail_url: String
  date_added: String
  date_last_updated: String
  deck: String
  description: String
  expected_release_day: String
  expected_release_month: String
  expected_release_quarter: String
  expected_release_year: String
  guid: String
  id: Int
  image: GbImage
  image_tags: [GbImageTags]
  name: String
  number_of_user_reviews: Int
  original_game_rating: [GbRating]
  original_release_date: String
  platforms: [GbPlatform]
  site_detail_url: String
}
extend type Query {
  igdbGameLookup (name: String!, platform: String!): [IgdbGame]
  gbGameLookup (name: String!, platform: Int!): [GbGame]
}
extend type Mutation {
  addGame(name: String!): Boolean
}
`;