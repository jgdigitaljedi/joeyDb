import { UserClass } from './User/User.resolvers';
import { GameClass } from './Game/Game.resolvers';
import { PlatformClass } from './Platform/Platform.resolvers';
import { AVDeviceClass } from './AVDevice/AVDevice.resolvers';
import { CloneClass } from './Clone/Clone.resolvers';
import { AccessoryClass } from './Accessory/Accessory.resolvers';
import { IResolvers } from 'graphql-tools';

const users = new UserClass();
const games = new GameClass();
const avDevices = new AVDeviceClass();
const platforms = new PlatformClass();
const clones = new CloneClass();
const acc = new AccessoryClass();

const Resolvers = {
  Query: { ...users.queries, ...games.queries, ...avDevices.queries, ...platforms.queries, ...clones.queries, ...acc.queries },
  Mutation: { ...users.mutations, ...games.mutations, ...avDevices.mutations, ...platforms.mutations, ...clones.mutations, ...acc.mutations }
}

const resolvers: IResolvers = Resolvers;

export default resolvers;