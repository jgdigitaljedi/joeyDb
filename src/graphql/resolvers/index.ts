import { UserClass } from './User/User.resolvers';
import { GameClass } from './Game/Game.resolvers';
import { PlatformClass } from './Platform/Platform.resolvers';
import { AVDeviceClass } from './AVDevice/AVDevice.resolvers';
import { CloneClass } from './Clone/Clone.resolvers';
import { AccessoryClass } from './Accessory/Accessory.resolvers';
import { CollectibleClass } from './Collectible/Collectible.resolvers';
import { UtilityClass } from './Utility/Utility.resolvers';
import { IResolvers } from 'graphql-tools';

const users = new UserClass();
const games = new GameClass();
const avDevices = new AVDeviceClass();
const platforms = new PlatformClass();
const clones = new CloneClass();
const acc = new AccessoryClass();
const coll = new CollectibleClass();
const util = new UtilityClass();

const Resolvers = {
  Query: {
    ...users.queries,
    ...games.queries,
    ...avDevices.queries,
    ...platforms.queries,
    ...clones.queries,
    ...acc.queries,
    ...coll.queries,
    ...util.queries
  },
  Mutation: {
    ...users.mutations,
    ...games.mutations,
    ...avDevices.mutations,
    ...platforms.mutations,
    ...clones.mutations,
    ...acc.mutations,
    ...coll.mutations,
    ...util.mutations
  }
}

const resolvers: IResolvers = Resolvers;

export default resolvers;