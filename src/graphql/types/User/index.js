
export default `
type User {
  id: Int!
  name: String!
  email: String!
}
type Query {
  me: User
}
type Mutation {
  addUser(id: String!, name: String!, email: String!): User
  editUser(id: String, name: String, email: String): User
  deleteUser(id: String, name: String, email: String): User
  login (email: String!, password: String!): String
}
`;