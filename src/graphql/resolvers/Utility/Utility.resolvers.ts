import { ForbiddenError, UserInputError, ApolloError } from 'apollo-server-express';
import { IContext, IId, IGetReq } from '../../globalModels/context.model';
import { Helpers } from '../../../util/helpers';
import fs from 'fs';
import path from 'path';
import { environment } from '../../../environment';

const logger = Helpers.apiLogger;

export class UtilityClass {
  _queries;
  _mutations;

  constructor() {
    this._queries = {
      async userLibraryCsv(_, { wl }: IGetReq, { user }: IContext) {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        // @TODO: write this
        return true;
      },
      async getLogFile(_, args, { user }: IContext): Promise<string> {
        if (!user || !user.admin) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        try {
          const logFile = await fs.readFileSync(path.join(environment.appRoot, `logs/results.log`), 'utf8');
          return logFile;
        } catch (error) {
          logger.write(`Utility.queries.getLog ERROR: ${error}`, 'error');
          throw new ApolloError(error);
        }
      }
    };

    this._mutations = {
      async clearLog(_, args, { user }: IContext) {
        if (!user || !user.admin) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        try {
          const deleted = await fs.writeFileSync(path.join(environment.appRoot, `logs/results.log`), '');
          return deleted;
        } catch (error) {
          logger.write(`Utility.mutations.clearLog ERROR: ${error}`, 'error');
          throw new ApolloError(error);
        }
      }
    };
  }

  get queries() {
    return this._queries;
  }

  get mutations() {
    return this._mutations;
  }
}