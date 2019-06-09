import { gql } from 'apollo-server-express';

const schema = gql`
type AVDevice {
  _id: String
  user: String!
  name: String!
  brand: String
  image: String
  channels: [String]
  inputs: [String]
  output: String
  location: String!
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
  location: String!
  wishlist: Boolean
}
input AVDeviceEditReq {
  id: String
  name: String
  brand: String
  image: String
  channels: [String]
  inputs: [String]
  output: String
  location: String
  wishlist: Boolean
}
extend type Query {
  userAVDevices(id: String, wl: String): [AVDevice]
}
extend type Mutation {
  addAVDevice(device: AVDeviceReq!): AVDevice
  editAVDevice(device: AVDeviceEditReq): AVDevice
  deleteAVDevice(id: String): Int
}
`;

export default schema;