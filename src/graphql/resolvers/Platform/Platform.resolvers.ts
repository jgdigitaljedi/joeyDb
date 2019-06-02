import { ForbiddenError, UserInputError, ApolloError } from 'apollo-server-express';
import { IContext } from '../../globalModels/context.model';
import { Helpers } from '../../../util/helpers';
import axios from 'axios';
import apicalypse from 'apicalypse';
import Platform from '../../../models/Platform';

export class PlatformClass {
  _queries;
  _mutations;
  platformCategories = {
    1: 'console',
    2: 'arcade',
    3: 'platform',
    4: 'operating system',
    5: 'portable console',
    6: 'computer'
  };

  constructor() {
    const that = this;
    this._queries = {
      async platformLookup(_, { search }, { user }) {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }

        const platformResults = await that._igdbLookup(search);
        console.log('platforms', platformResults.data);
        return platformResults;
      }
    };

    this._mutations = {
      async addGame(_, game, { user }) {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }

        return true;
      }
    };
  }

  get queries() {
    return this._queries;
  }

  get mutations() {
    return this._mutations;
  }

  private _igdbLookup(name: string): Promise<any> {
    console.log('name', name);
    const requestOptions = {
      method: 'POST',
      baseURL: 'https://api-v3.igdb.com',
      headers: {
        'Accept': 'application/json',
        'user-key': process.env.IGDBV3KEY
      },
    };
    return apicalypse(requestOptions)
      .fields(`alternative_name,category,generation,name,summary,versions.main_manufacturer.company,versions.name,versions.storage,versions.platform_version_release_dates.date`)
      .search(name)
      // .where(`name = ${name}`)
      .request('/platforms');
  }
}