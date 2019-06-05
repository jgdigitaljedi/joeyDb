import { ForbiddenError, UserInputError, ApolloError } from 'apollo-server-express';
import { IContext } from '../../globalModels/context.model';
import { Helpers } from '../../../util/helpers';
import axios from 'axios';
import apicalypse from 'apicalypse';
import Platform from '../../../models/Platform';
import moment from 'moment';
import { IIgdbPlatform, IIgdbPlatformResponse, IUserPlatform, IPlatformDocument, IPlatformReq } from './Platform.model';

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
      async myPlatforms(_, { wl }, { user }: IContext): Promise<IPlatformDocument[]> {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        const wishlist = wl && wl !== {} ? true : false;
        const platforms = await Platform.find({ userId: user.id, wishlist });
        return platforms;
      }
    };

    this._mutations = {
      async addPlatform(_, { platform }: IPlatformReq, { user }: IContext): Promise<IUserPlatform> {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        if (!platform) {
          throw new UserInputError('You must send the required platform data to save a platform!');
        }
        try {
          const newPlatform = new Platform(platform);
          newPlatform.userId = user.id;
          newPlatform.createdTimestamp();
          newPlatform.updatedTimestamp();
          const saved = await newPlatform.save();
          return saved;
        } catch (err) {
          throw new ApolloError(err);
        }
      },
      async deletePlatform(_, { id }, { user }: IContext): Promise<Number> {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        if (!id) {
          throw new UserInputError('You must send a platform ID to delete the platform!');
        }
        try {
          const toDelete = Platform.findOne({ userId: user.id, id });
          const deleted = await toDelete.remove();
          return deleted.ok;
        } catch (err) {
          throw new ApolloError(err);
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