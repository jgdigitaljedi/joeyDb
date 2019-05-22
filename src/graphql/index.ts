import { ApolloServer } from 'apollo-server-express';
import typeDefs from "./types";
import resolvers from "./resolvers";
import { environment } from '../environment';

let playgroundDev;
if (environment.apollo.playground) {
  playgroundDev = {
    endpoint: `http://localhost:3000/api/graphql`,
    settings: {
      'editor.theme': 'dark'
    }
  };
} else {
  playgroundDev = undefined;
}

const SERVER = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: environment.apollo.introspection,
  playground: playgroundDev
});

export default SERVER;