import { gql } from 'apollo-server-express';

const schema = gql`
input AccReq {
  name: String
  _id: String
}
type Acc {
  name: String
  _id: String
}
extend type Query {
  userAcc(id: String, wl: String): [Acc]
}
extend type Mutation {
  addAcc(clone: AccReq!): Acc
  editAcc(clone: AccReq): Acc
  deleteAcc(id: String): Int
}
`;

export default schema;