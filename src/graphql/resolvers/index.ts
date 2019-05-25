// import { UserQuery, UserMutation } from './User/User.resolvers';
import { UserClass } from './User/User.resolvers';
import { GameClass } from './Game/Game.resolvers';
import { IResolvers } from 'graphql-tools';

const Resolvers = {
  Query: { ...UserClass.queries(), ...GameClass.queries() },
  Mutation: { ...UserClass.mutations(), ...GameClass.mutations() }
}

const resolvers: IResolvers = Resolvers;

export default resolvers;