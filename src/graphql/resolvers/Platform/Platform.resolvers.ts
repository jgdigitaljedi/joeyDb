import { ForbiddenError, UserInputError, ApolloError } from 'apollo-server-express';
import { IContext } from '../../globalModels/context.model';
import { Helpers } from '../../../util/helpers';
import axios from 'axios';
import apicalypse from 'apicalypse';
import Platform from '../../../models/Platform';
import moment from 'moment';
import { IIgdbPlatform, IIgdbPlatformResponse } from './Platform.model';

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
      async platformLookup(_, { name }, { user }: IContext): Promise<IIgdbPlatform[]> {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }

        try {
          const platformResults = await that._igdbLookup(name);
          const resultsData = platformResults.data.map(platform => {
            if (platform && platform.category) {
              platform.category = that.platformCategories[platform.category];
            }
            if (platform && platform.id) {
              platform.igdbId = platform.id;
              delete platform.id;
            }
            if (platform && platform.versions && platform.versions.length) {
              const pvCopy = [...platform.versions];
              platform.versions = pvCopy.map(version => {
                if (version.platform_version_release_dates && version.platform_version_release_dates.length && version.platform_version_release_dates[0].hasOwnProperty('date')) {
                  version.first_release_date = moment(version.platform_version_release_dates[0].date * 1000).format('MM/DD/YYYY');
                }
                return version;
              });
            }
            return platform;
          });
          return resultsData;
        } catch (error) {
          new ApolloError('Something went wrong fetching or parsing IGDB platform call!');
        }
      },
      async myPlatforms(_, args, { user }: IContext) {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        const platforms = await Platform.find({ userId: user.id, wishlist: false });
        return platforms;
      },
      async myPlatformsWishlist(_, args, { user }: IContext) {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        const platforms = await Platform.find({ userId: user.id, wishlist: false });
        return platforms;
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

  private _igdbLookup(name: string): Promise<IIgdbPlatformResponse> {
    const requestOptions = {
      method: 'POST',
      baseURL: 'https://api-v3.igdb.com',
      headers: {
        'Accept': 'application/json',
        'user-key': process.env.IGDBV3KEY
      },
    };
    return apicalypse(requestOptions)
      .fields(`alternative_name,category,generation,name,summary,versions.name,versions.storage,versions.platform_version_release_dates.date`)
      .search(name)
      .request('/platforms');
  }
}