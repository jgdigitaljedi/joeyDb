import { UserQuery, UserMutation } from './User/User.resolvers';
import { GameQuery, GameMutation } from './Game/Game.resolvers';
import { IResolvers } from 'graphql-tools';

const Resolvers = {
  Query: { ...UserQuery, ...GameQuery },
  Mutation: { ...UserMutation, ...GameMutation }
}

const resolvers: IResolvers = Resolvers;

export default resolvers;