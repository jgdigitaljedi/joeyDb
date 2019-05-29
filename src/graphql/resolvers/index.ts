import { UserClass } from './User/User.resolvers';
import { GameClass } from './Game/Game.resolvers';
import { IResolvers } from 'graphql-tools';
import { merge } from 'lodash';

const Resolvers = {
  Query: { ...UserClass.queries(), ...GameClass.queries() },
  Mutation: { ...UserClass.mutations(), ...GameClass.mutations() }
}
// const Resolvers = merge(UserClass.queries(), GameClass.queries(), UserClass.mutations(), GameClass.mutations())

const resolvers: IResolvers = Resolvers;

export default resolvers;