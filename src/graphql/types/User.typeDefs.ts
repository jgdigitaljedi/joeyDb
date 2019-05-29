import { gql } from 'apollo-server-express';

export default gql`
type User {
  id: String!
  name: String!
  email: String!,
  created: String!,
  updated: String!,
  admin: Boolean!
}
type Query {
  me: User,
  users: [User]
}
type Mutation {
  signup (name: String!, email: String!, password: String!): String
  editUser(name: String, email: String, password: String): User
  deleteMe(name: String, email: String, password: String): User
  deleteUser(key: String, value: String): User
  login (email: String!, password: String!): String
}
`;