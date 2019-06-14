import { gql } from 'apollo-server-express';

const schema = gql`
type BcList {
  igdbId: Int
  name: String
  notes: [String]
}
type XboxGames {
  xts: [BcList]
  xbo: [BcList]
}
type XboxGameCheck {
  xts: Boolean
  xbo: Boolean
}
extend type Query {
  bcListForOriginalGame(id: String, name: String): XboxGameCheck
  bcListForThreeSixtyGame(id: String, name: String): Boolean
  xboxGameLists: XboxGames
  xboxThreeSixtyGameList: [BcList]
}
`;

export default schema;