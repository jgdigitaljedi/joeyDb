import { UserQuery, UserMutation } from './User/User.resolvers';
import { IResolvers } from 'graphql-tools';

const Resolvers = {
  Query: { ...UserQuery },
  Mutation: { ...UserMutation }
}

const resolvers: IResolvers = Resolvers;

export default resolvers;