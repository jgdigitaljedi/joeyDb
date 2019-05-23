import { ApolloServer } from 'apollo-server-express';
import typeDefs from "./types";
import resolvers from "./resolvers";
import { environment } from '../environment';
import jsonwebtoken from 'jsonwebtoken';

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

function checkToken(token) {
  if (token) {
    const tSplit = token.split(' ');
    console.log('tSplit', tSplit[1]);
    if (tSplit && tSplit[0] === 'Bearer' && tSplit.length === 2) {
      jsonwebtoken.verify(token[1].trim(), process.env.JOEYDBSECRET, (err, decoded) => {
        console.log('decoded', decoded);
        console.log('err', err);
      });
    } else {
      return false;
    }
  } else {
    return false;
  }
}

const SERVER = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: environment.apollo.introspection,
  playground: playgroundDev,
  context: ({ req }) => {
    const token = req.headers.authorization;
    checkToken(token);
    return { token };
  },
});

export default SERVER;