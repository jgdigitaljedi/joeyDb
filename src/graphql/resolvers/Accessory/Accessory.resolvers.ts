import { ForbiddenError, UserInputError, ApolloError } from 'apollo-server-express';
import { IContext, IId, IGetReq } from '../../globalModels/context.model';
import { Helpers } from '../../../util/helpers';
import Accessory from '../../../models/Accessory';
import { IAccessoryDocument } from './Accessory.model';

const logger = Helpers.apiLogger;

export class AccessoryClass {
  _queries;
  _mutations;

  constructor() {
    this._queries = {
    };

    this._mutations = {
    };
  }

  get queries() {
    return this._queries;
  }

  get mutations() {
    return this._mutations;
  }
}