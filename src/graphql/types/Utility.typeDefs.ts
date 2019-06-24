import { gql } from 'apollo-server-express';

export default gql`
extend type Query {
  userLibraryCsv (wl: Boolean): Boolean
  getLogFile: String
}
extend type Mutation {
  clearLog: Boolean
}
`;