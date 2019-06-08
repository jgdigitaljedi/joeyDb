import { ForbiddenError, UserInputError, ApolloError } from 'apollo-server-express';
import { IContext, IId, IGetReq } from '../../globalModels/context.model';
import { Helpers } from '../../../util/helpers';
import AVDevice from '../../../models/AVDevice';
import { IAVDeviceDocument, IAVDeviceDevice } from './AVDevice.model';

const logger = Helpers.apiLogger;

export class AVDeviceClass {
  _queries;
  _mutations;

  constructor() {
    this._queries = {
      async userAVDevices(_, { id, wl }: IGetReq, { user }: IContext): Promise<IAVDeviceDocument[]> {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        try {
          if (id) {
            // return 1 device
            const device = await AVDevice.findOne({ user: user.id, _id: id });
            return [device];
          } else if (wl) {
            // return devices wishlist or owned; wl must be passed as string
            const devices = await AVDevice.find({ user: user.id, wishlist: JSON.parse(wl) });
            return devices;
          } else {
            // return all user devices both from wishlist and owned
            const devices = await AVDevice.find({ user: user.id });
            return devices;
          }
        } catch (err) {
          logger.write(`AVDevice.queries.userAVDevices ERROR: ${err}`, 'error');
          throw new ApolloError(err);
        }
      }
    };

    this._mutations = {
      async addAVDevice(_, { device }: IAVDeviceDevice, { user }: IContext): Promise<IAVDeviceDocument> {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        try {
          const newDevice = new AVDevice(device);
          newDevice.user = user.id;
          newDevice.createdTimestamp();
          newDevice.updatedTimestamp();
          const added = await newDevice.save();
          return added;
        } catch (err) {
          logger.write(`AVDevice.mutations.addAVDevice ERROR: ${err}`, 'error');
          throw new ApolloError(err);
        }
      },
      async editAVDevice(_, { device }: IAVDeviceDevice, { user }: IContext): Promise<IAVDeviceDocument> {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        try {
          const toEdit = await AVDevice.findOne({ _id: device._id, user: user.id });
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
          logger.write(`AVDevice.mutations.editAVDevice ERROR: ${err}`, 'error');
          throw new ApolloError(err);
        }
      },
      async deleteAVDevice(_, { id }: IId, { user }: IContext): Promise<Number> {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        if (!id) {
          throw new UserInputError('You must send an AV Device ID to delete the platform!');
        }
        try {
          const toDelete = AVDevice.findOne({ user: user.id, _id: id });
          const deleted = await toDelete.remove();
          return deleted.ok;
        } catch (err) {
          logger.write(`AVDevice.mutations.deleteAVDevice ERROR: ${err}`, 'error');
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