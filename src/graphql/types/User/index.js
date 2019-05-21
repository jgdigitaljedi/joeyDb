import { gql } from 'apollo-server-express';

export default gql`
type User {
  id: Int!
  name: String!
  email: String!
}
type Query {
  me: User
}
type Mutation {
  signup (name: String!, email: String!, password: String!): String
  editUser(id: String, name: String, email: String): User
  deleteUser(id: String, name: String, email: String): User
  login (email: String!, password: String!): String
}
`;