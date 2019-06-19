import { IGameDocument, IGameGbData, IGameIgdbData, IGameIgdbResponse } from './Game.model';
import { ForbiddenError, UserInputError, ApolloError } from 'apollo-server-express';
import { IContext } from '../../globalModels/context.model';
import { Helpers } from '../../../util/helpers';
import axios from 'axios';
import apicalypse from 'apicalypse';
import Game from '../../../models/Game';
import XboxToXboxOne from '../../../static/xboxToXboxOne.json';
import XboxToXboxThreeSixty from '../../../static/xboxToXboxThreeSixty.json';
import Xbox360ToXboxOne from '../../../static/xbox360ToXboxOne.json';
import { ObjectID } from 'bson';

const gbKey = process.env.JGBKEY;
const logger = Helpers.apiLogger;

export class GameClass {
  _queries;
  _mutations;
  ageRatings = {
    1: 'Three',
    2: 'Seven',
    3: 'Twelve',
    4: 'Sixteen',
    5: 'Eighteen',
    6: 'RP',
    7: 'EC',
    8: 'E',
    9: 'E10',
    10: 'T',
    11: 'M',
    12: 'AO'
  };
  xboxId = 11;
  xboxTsId = 12;

  constructor() {
    const that = this;
    this._queries = {
      async igdbGameLookup(_, { name, platform }, { user }: IContext): Promise<IGameIgdbData[]> {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        if (!name && !platform) {
          throw new UserInputError('You must send a name and platform to search for a game!');
        }

        try {
          const igdbData = await that._igdbLookup(name, platform);
          const dCopy = [...igdbData.data];
          const withAgeRatings = dCopy.map(game => {
            if (game.age_ratings && game.age_ratings.length) {
              game.age_ratings = [...game.age_ratings].map(rating => {
                rating.translated = that.ageRatings[rating.rating];
                return rating;
              });
            }
            const bkwd = that._xboxBkwdLookup(game);
            game.xboxOneBkwd = bkwd.xboxOneBkwd;
            game.threeSixtyBkwd = bkwd.threeSixtyBkwd;
            return game;
          });
          return withAgeRatings;
        } catch (error) {
          logger.write(`Game.queries.igdbGameLookup ERROR: ${error}`, 'error');
          throw new ApolloError(error);
        }
      },
      async gbGameLookup(_, { name, platform }, { user }: IContext): Promise<IGameGbData> {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        if (!name && !platform) {
          throw new UserInputError('You must send a name and platform to search for a game!');
        }

        try {
          const urlName = encodeURI(name);
          const gbData = await that._giantBombLookup(urlName, platform);
          return gbData;
        } catch (error) {
          logger.write(`Game.queries.gbGameLookup ERROR: ${error}`, 'error');
          throw new ApolloError(error);
        }
      },
      async ageRatingsEnum(_, { rating }, { user }: IContext): Promise<string> {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        return that.ageRatings[rating];
      },
      async userGames(_, { wl, id, platformId }, { user }: IContext): Promise<IGameDocument[]> {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        try {
          let games;
          if (id) {
            games = await Game.find({ user: new ObjectID(user.id), _id: id }).populate('user').exec();
          } else if (platformId) {
            return await Game.find({ user: new ObjectID(user.id) }).populate('user platform').then(results => {
              if (wl === undefined) {
                results = results.filter(r => {
                  return r['platform'].igdbId === platformId;
                });
              } else {
                results = results.filter(r => {
                  return r['platform'].igdbId === platformId && r['wishlist'] === wl;
                });
              }
              return results;
            });
          } else if (wl) {
            games = await Game.find({ user: new ObjectID(user.id), wishlist: true }).populate('user').populate('platform').exec();
          } else {
            games = await Game.find({ user: new ObjectID(user.id), wishlist: false }).populate('user').populate('platform').exec();
          }
          return games;
        } catch (err) {
          logger.write(`Game.queries.userGames ERROR: ${err}`, 'error');
          throw new ApolloError(err);
        }
      }
    };

    this._mutations = {
      async addGame(_, { newGame }, { user }: IContext): Promise<IGameDocument> {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }

        try {
          const game = new Game(newGame);
          game.user = user.id;
          game.createdTimestamp();
          game.updatedTimestamp();
          const savedGame: IGameDocument = await game.save();
          return savedGame;
        } catch (error) {
          logger.write(`Game.mutations.addGame ERROR: ${error}`, 'error');
          throw new ApolloError(error);
        }
      },
      async editGame(_, { data }, { user }: IContext): Promise<IGameDocument> {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        if (!data.id) {
          throw new UserInputError('You must send a game ID in the arguments to edit a game!');
        }

        try {
          const game = await Game.findOne({ user: new ObjectID(user.id), _id: data.id }).populate('user').populate('platform').exec();
          const keys = Object.keys(data);
          keys.forEach(key => {
            if (key !== '_id' && key !== 'user' && key !== 'created' && key !== 'updated') {
              game[key] = data[key];
            }
          });
          game.updatedTimestamp();
          const saved = game.save();
          return saved;
        } catch (error) {
          logger.write(`Game.mutations.editGame ERROR: ${error}`, 'error');
          throw new ApolloError(error);
        }
      },
      async deleteGame(_, { id }, { user }: IContext): Promise<IGameDocument> {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        if (!id) {
          throw new UserInputError('You must send a game ID in the arguments to edit a game!');
        } try {
          const game = await Game.findOne({ user: new ObjectID(user.id), _id: id }).populate('user').populate('platform').exec();
          const removed = await game.remove();
          return removed;
        } catch (error) {
          logger.write(`Game.mutations.deleteGame ERROR: ${error}`, 'error');
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

  private _xboxBkwdLogic(id, data) {
    const filtered = data.filter(d => d.igdbId === id);
    return filtered && filtered.length ? filtered[0] : Object.assign({}, { bkwd: false, notes: null });
  }

  private _xboxBkwdLookup(game) {
    if (game.id === 11) {
      return {
        xboxOneBkwd: this._xboxBkwdLogic(game.id, XboxToXboxOne),
        threeSixtyBkwd: this._xboxBkwdLogic(game.id, XboxToXboxThreeSixty)
      };
    } else if (game.id === 12) {
      return {
        xboxOneBkwd: this._xboxBkwdLogic(game.id, Xbox360ToXboxOne),
        threeSixtyBkwd: { bkwd: false, notes: null }
      };
    }
    return {
      xboxOneBkwd: { bkwd: false, notes: null },
      threeSixtyBkwd: { bkwd: false, notes: null }
    };
  }

  private _giantBombLookup(name: string, platform: number): Promise<IGameGbData> {
    return axios
      .get(
        `https://api.giantbomb.com/games/?api_key=${gbKey}&filter=name:${name},platforms:${platform}&format=json`
      )
      .then(result => {
        if (result && result.data && result.data.results) {
          try {
            const cleaned = result.data.results.map(item => {
              item.gbid = item.id;
              return item;
            });
            return cleaned;
          } catch (err) {
            return err;
          }
        } else {
          return result;
        }
      })
      .catch(error => {
        return error;
      });
  }

  private _igdbLookup(name: string, platform: number): Promise<IGameIgdbResponse> {
    const requestOptions = {
      method: 'POST',
      baseURL: 'https://api-v3.igdb.com',
      headers: {
        'Accept': 'application/json',
        'user-key': process.env.IGDBV3KEY
      },
    };
    return apicalypse(requestOptions)
      .fields(`age_ratings.rating,aggregated_rating,aggregated_rating_count,alternative_names.name,collection.name,cover.url,first_release_date,game_engines,genres.name,name,platforms.name,summary`)
      .search(name)
      .where(`platforms = [${platform}]`)
      .request('/games');
  }
}