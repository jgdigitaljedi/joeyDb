import { ForbiddenError, UserInputError, ApolloError } from 'apollo-server-express';
import { IContext, IId, IGetReq } from '../../globalModels/context.model';
import { Helpers } from '../../../util/helpers';
import Clone from '../../../models/Clone';
import { ICloneDocument } from './Clone.model';

const logger = Helpers.apiLogger;

export class CloneClass {
  _queries;
  _mutations;

  constructor() {
    this._queries = {
      async userClones(_, { id, wl }: IGetReq, { user }: IContext): Promise<ICloneDocument[]> {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        try {
          if (id) {
            // return 1 clone
            const device = await Clone.findOne({ user: user.id, _id: id });
            return [device];
          } else if (wl) {
            // return clones wishlist or owned; wl must be passed as string
            const devices = await Clone.find({ user: user.id, wishlist: JSON.parse(wl) });
            return devices;
          } else {
            // return all user clones both from wishlist and owned
            const devices = await Clone.find({ user: user.id });
            return devices;
          }
        } catch (err) {
          logger.write(`Clone.queries.userClones ERROR: ${err}`, 'error');
          throw new ApolloError(err);
        }
      }
    };

    this._mutations = {
      async addClone(_, { clone }, { user }: IContext): Promise<ICloneDocument> {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        try {
          const newClone = new Clone(clone);
          newClone.user = user.id;
          newClone.createdTimestamp();
          newClone.updatedTimestamp();
          const added = await newClone.save();
          return added;
        } catch (err) {
          logger.write(`Clone.mutations.addClone ERROR: ${err}`, 'error');
          throw new ApolloError(err);
        }
      },
      async editClone(_, { device }, { user }: IContext): Promise<ICloneDocument> {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        try {
          const toEdit = await Clone.findOne({ _id: device.id, user: user.id });
          const editObj = toEdit.toObject();
          const keys = Object.keys(device);
          const errorArr = [];
          keys.forEach(key => {
            if (key !== 'id' && key !== 'created' && key !== 'updated' && key !== 'user') {
              if (editObj.hasOwnProperty(key)) {
                toEdit[key] = device[key];
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
          logger.write(`Clone.mutations.editClone ERROR: ${err}`, 'error');
          throw new ApolloError(err);
        }
      },
      async deleteClone(_, { id }: IId, { user }: IContext): Promise<Number> {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        if (!id) {
          throw new UserInputError('You must send a Clone ID to delete the clone!');
        }
        try {
          const toDelete = Clone.findOne({ user: user.id, _id: id });
          const deleted = await toDelete.remove();
          return deleted.ok;
        } catch (err) {
          logger.write(`Clone.mutations.deleteClone ERROR: ${err}`, 'error');
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