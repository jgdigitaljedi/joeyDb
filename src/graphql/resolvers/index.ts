import { UserClass } from './User/User.resolvers';
import { GameClass } from './Game/Game.resolvers';
import { IResolvers } from 'graphql-tools';
import { merge } from 'lodash';

const users = new UserClass();
const games = new GameClass();

const Resolvers = {
  Query: { ...users.queries, ...games.queries },
  Mutation: { ...users.mutations, ...games.mutations }
}
// const Resolvers = merge(UserClass.queries(), GameClass.queries(), UserClass.mutations(), GameClass.mutations())

const resolvers: IResolvers = Resolvers;

export default resolvers;