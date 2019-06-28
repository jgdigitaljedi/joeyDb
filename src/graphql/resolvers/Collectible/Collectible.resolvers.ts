import { ForbiddenError, UserInputError, ApolloError } from 'apollo-server-express';
import { IContext, IId, IGetReq } from '../../globalModels/context.model';
import { Helpers } from '../../../util/helpers';
import Collectible from '../../../models/Collectible';
import { ICollectibleDocument, ICollReq } from './Collectible.model';

const logger = Helpers.apiLogger;

export class CollectibleClass {
  _queries;
  _mutations;

  constructor() {
    this._queries = {
      async userCollectibles(_, { id, wl }: IGetReq, { user }: IContext): Promise<ICollectibleDocument[]> {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        try {
          if (id) {
            // return 1 collectible
            const coll = await Collectible.findOne({ user: user.id, _id: id }).populate('forPlatforms');
            return [coll];
          } else if (wl) {
            // return collectibles wishlist or owned; wl must be passed as string
            const coll = await Collectible.find({ user: user.id, wishlist: JSON.parse(wl) }).populate('forPlatforms');
            return coll;
          } else {
            // return all user collectibles both from wishlist and owned
            const coll = await Collectible.find({ user: user.id }).populate('forPlatforms');
            return coll;
          }
        } catch (err) {
          logger.write(`Collectible.queries.userCollectibles ERROR: ${err}`, 'error');
          throw new ApolloError(err);
        }
      }
    };

    this._mutations = {
      async addCollectible(_, { coll }: ICollReq, { user }: IContext): Promise<ICollectibleDocument> {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        try {
          const newColl = new Collectible(coll);
          newColl.user = user.id;
          newColl.createdTimestamp();
          newColl.updatedTimestamp();
          const added = await newColl.save();
          return added;
        } catch (err) {
          logger.write(`Collectible.mutations.addCollectible ERROR: ${err}`, 'error');
          throw new ApolloError(err);
        }
      },
      async editCollectible(_, { coll }: ICollReq, { user }: IContext): Promise<ICollectibleDocument> {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        try {
          const toEdit = await Collectible.findOne({ _id: coll.id, user: user.id }).populate('forPlatforms');
          const editObj = toEdit.toObject();
          const keys = Object.keys(coll);
          const errorArr = [];
          keys.forEach(key => {
            if (key !== 'id' && key !== 'created' && key !== 'updated' && key !== 'user') {
              if (editObj.hasOwnProperty(key)) {
                toEdit[key] = coll[key];
              } else {
                errorArr.push(key)
              }
            }
          });
          if (errorArr.length) {
            throw new UserInputError(`No field(s) exist for argument(s): ${errorArr.join(', ')}`);
          } else {
            toEdit.updatedTimestamp();
            const saved = toEdit.save();
            return saved;
          }
        } catch (err) {
          logger.write(`Collectible.mutations.editColllectible ERROR: ${err}`, 'error');
          throw new ApolloError(err);
        }
      },
      async deleteCollectible(_, { id }: IId, { user }: IContext): Promise<Number> {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        if (!id) {
          throw new UserInputError('You must send a Clone ID to delete the clone!');
        }
        try {
          const toDelete = Collectible.findOne({ user: user.id, _id: id });
          const deleted = await toDelete.remove();
          return deleted.ok;
        } catch (err) {
          logger.write(`Collectible.mutations.deleteCollectible ERROR: ${err}`, 'error');
          throw new ApolloError(err);
        }
      },
    };
  }

  get queries() {
    return this._queries;
  }

  get mutations() {
    return this._mutations;
  }
}