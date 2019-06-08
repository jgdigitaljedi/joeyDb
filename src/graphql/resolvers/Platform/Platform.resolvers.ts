import { ForbiddenError, UserInputError, ApolloError } from 'apollo-server-express';
import { IContext } from '../../globalModels/context.model';
import { Helpers } from '../../../util/helpers';
import apicalypse from 'apicalypse';
import Platform from '../../../models/Platform';
import moment from 'moment';
import { IIgdbPlatform, IIgdbPlatformResponse, IUserPlatform, IPlatformDocument, IPlatformReq, IPlatformCategories } from './Platform.model';
import AVDevice from '../../../models/AVDevice';

const logger = Helpers.apiLogger;

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
          logger.write(`Platform.queries.platformLookup ERROR: ${error}`, 'error');
          new ApolloError(error);
        }
      },
      async myPlatforms(_, { wl }, { user }: IContext): Promise<IPlatformDocument[]> {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        try {
          const wishlist = wl && wl !== {} ? true : false;
          const platforms = await Platform.find({ user: user.id, wishlist }).populate('connectionChain.device').exec();
          return platforms;
        } catch (err) {
          logger.write(`Platform.queries.myPlatforms ERROR: ${err}`, 'error');
          throw new ApolloError(err)
        }
      },
      getPlatformCategories(_, args, { user }: IContext): IPlatformCategories[] {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        const keys = Object.keys(that.platformCategories);
        const pc = keys.map(key => {
          return { id: parseInt(key), name: that.platformCategories[key] };
        });
        return pc;
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
          newPlatform.user = user.id;
          newPlatform.createdTimestamp();
          newPlatform.updatedTimestamp();
          const saved = await newPlatform.save();
          return saved;
        } catch (err) {
          logger.write(`Platform.mutations.addPlatform ERROR: ${err}`, 'error');
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
          const toDelete = Platform.findOne({ user: user.id, _id: id });
          const deleted = await toDelete.remove();
          return deleted.ok;
        } catch (err) {
          logger.write(`Platform.mutations.deletePlatform ERROR: ${err}`, 'error');
          throw new ApolloError(err);
        }
      },
      async editPlatform(_, { platform }, { user }: IContext): Promise<IUserPlatform> {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        if (!platform.id) {
          throw new UserInputError('You must send a platform ID to edit the platform!');
        }
        try {
          const toEdit = await Platform.findOne({ _id: platform.id, user: user.id });
          const editObj = toEdit.toObject();
          const keys = Object.keys(platform);
          const errorArr = [];
          keys.forEach(key => {
            if (key !== 'id' && key !== 'created' && key !== 'updated' && key !== 'user') {
              if (editObj.hasOwnProperty(key)) {
                toEdit[key] = platform[key];
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
          logger.write(`Platform.mutations.editPlatform ERROR: ${err}`, 'error');
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