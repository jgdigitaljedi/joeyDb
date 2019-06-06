import { gql } from 'apollo-server-express';

const schema = gql`
type AVDevice {
  id: String
  userId: String!
  name: String!
  brand: String
  image: String
  channels: [String]
  inputs: [String]
  output: String
  wishlist: Boolean
  created: String
  updated: String
}
input AVDeviceReq {
  id: String
  name: String!
  brand: String
  image: String
  channels: [String]
  inputs: [String]
  output: String
  wishlist: Boolean
}
extend type Query {
  userAVDevices(id: String): [AVDevice]
}
extend type Mutation {
  addAVDevice(device: AVDeviceReq!): AVDevice
  editAVDevice(device: AVDeviceReq): AVDevice
  deleteAVDevice(id: String): Int
}
`;

export default schema;