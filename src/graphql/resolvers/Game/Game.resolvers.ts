import { IGameDocument, IGameGbData, IGameIgdbData, IGameIgdbResponse } from './Game.model';
import { ForbiddenError, UserInputError, ApolloError } from 'apollo-server-express';
import { IContext } from '../../globalModels/context.model';
import { Helpers } from '../../../util/helpers';
import axios from 'axios';
import apicalypse from 'apicalypse';
import Game from '../../../models/Game';

const gbKey = process.env.JGBKEY;

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

  constructor() {
    const that = this;
    this._queries = {
      async igdbGameLookup(_, { name, platform }, { user }: IContext): Promise<IGameIgdbData[]> {
        if (user) {
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
              return game;
            });
            return withAgeRatings;
          } catch (error) {
            throw new ApolloError(error);
          }
        } else {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
      },
      async gbGameLookup(_, { name, platform }, { user }: IContext): Promise<IGameGbData> {
        if (user) {
          try {
            const urlName = encodeURI(name);
            const gbData = await that._giantBombLookup(urlName, platform);
            return gbData;
          } catch (error) {
            throw new ApolloError(error);
          }
        } else {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
      },
      async ageRatingsEnum(_, { rating }, { user }: IContext): Promise<string> {
        if (user) {
          return that.ageRatings[rating];
        } else {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
      }
    };

    this._mutations = {
      async addGame(_, data: IGameDocument, { user }: IContext) {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }

        try {
          const game = new Game(data);
          game.userId = user.id;
          game.createdTimestamp();
          game.updatedTimestamp();
          const savedGame: IGameDocument = await game.save();
          return savedGame;
        } catch (error) {
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