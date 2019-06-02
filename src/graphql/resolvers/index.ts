import { UserClass } from './User/User.resolvers';
import { GameClass } from './Game/Game.resolvers';
import { PlatformClass } from './Platform/Platform.resolvers';
import { IResolvers } from 'graphql-tools';
import { merge } from 'lodash';

const users = new UserClass();
const games = new GameClass();
const platforms = new PlatformClass();

const Resolvers = {
  Query: { ...users.queries, ...games.queries, ...platforms.queries },
  Mutation: { ...users.mutations, ...games.mutations, ...platforms.mutations }
}
// const Resolvers = merge(UserClass.queries(), GameClass.queries(), UserClass.mutations(), GameClass.mutations())

const resolvers: IResolvers = Resolvers;

export default resolvers;