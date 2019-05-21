import { ApolloServer } from 'apollo-server-express';

import typeDefs from "./types/";
import resolvers from "./resolvers/";

const SERVER = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    endpoint: `http://localhost:3000/api/graphql`,
    settings: {
      'editor.theme': 'dark'
    }
  }
});

export default SERVER;