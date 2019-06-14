import { ForbiddenError, UserInputError, ApolloError } from 'apollo-server-express';
import { IContext, IId, IGetReq } from '../../globalModels/context.model';
import { Helpers } from '../../../util/helpers';
import { IBackwardComp } from './BackwardComp.model';
import xboxToThreeSixtyList from '../../../static/xboxToXboxThreeSixty.json';
import xboxToXboxOneList from '../../../static/xboxToXboxOne.json';
import xboxThreeSixtyToXboxOneList from '../../../static/xbox360ToXboxOne.json';

const logger = Helpers.apiLogger;

export class BackwardCompClass {
  _queries;
  _mutations;

  constructor() {
    this._queries = {
      async bcListForOriginalGame(_, { name, id }, { user }: IContext) {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage)
        }
        try {
          if (id) {
            return {
              xts: xboxToThreeSixtyList.filter(game => game.igdbId === id).length > 0,
              xbo: xboxToXboxOneList.filter(game => game.igdbId === id).length > 0
            };
          } else if (name) {
            return {
              xts: xboxToThreeSixtyList.filter(game => game.name === name).length > 0,
              xbo: xboxToXboxOneList.filter(game => game.name === name).length > 0
            };
          } else {
            throw new UserInputError('You must send a name or an id of an Xbox 360 game to check for backwards compatibility!');
          }
        } catch (error) {
          logger.write(`BackwardComp.queries.bcListForThreeSixtyGame ERROR: ${error}`);
          throw new ApolloError(error);
        }
      },
      async bcListForThreeSixtyGame(_, { name, id }, { user }: IContext) {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage)
        }
        try {
          if (id) {
            return xboxThreeSixtyToXboxOneList.filter(game => game.igdbId === id).length > 0;
          } else if (name) {
            return xboxThreeSixtyToXboxOneList.filter(game => game.name === name).length > 0;
          } else {
            throw new UserInputError('You must send a name or an id of an Xbox 360 game to check for backwards compatibility!');
          }
        } catch (error) {
          logger.write(`BackwardComp.queries.bcListForThreeSixtyGame ERROR: ${error}`);
          throw new ApolloError(error);
        }
      },
      async xboxGameLists(_, args, { user }: IContext) {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage)
        }
        try {
          return { xts: xboxToThreeSixtyList, xbo: xboxToXboxOneList };
        } catch (error) {
          logger.write(`BackwardComp.queries.xboxGameLists ERROR: ${error}`);
          throw new ApolloError(error);
        }
      },
      async xboxThreeSixtyGameList(_, args, { user }: IContext) {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage)
        }
        try {
          return xboxThreeSixtyToXboxOneList;
        } catch (error) {
          logger.write(`BackwardComp.queries.xboxThreeSixtyGameList ERROR: ${error}`);
          throw new ApolloError(error);
        }
      }
    };

    this._mutations = {};
  }

  get queries() {
    return this._queries;
  }

  get mutations() {
    return this._mutations;
  }
}