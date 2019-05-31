import { IGameDocument } from './Game.model';
import { ForbiddenError, UserInputError } from 'apollo-server-express';
import { IContext } from '../../globalModels/context.model';
import axios from 'axios';
import apicalypse from 'apicalypse';

const gbKey = process.env.JGBKEY;

export class GameClass {
  public static queries() {
    const that = this;
    return {
      async igdbGameLookup(_, { name, platform }, { user }) {
        if (user) {
          const igbData = await that._igdbLookup(name, platform);
          return igbData.data;
        } else {
          throw new ForbiddenError('Invalid token! You do not have permission to do that!');
        }
      },
      async gbGameLookup(_, { name, platform }, { user }) {
        if (user) {
          const urlName = encodeURI(name);
          const gbData = await that._giantBombLookup(urlName, platform);
          return gbData;
        } else {
          throw new ForbiddenError('Invalid token! You do not have permission to do that!');
        }
      }
    };
  }
  public static mutations() {
    return {
      async addGame(_, args, { user }) {
        return true;
      }
    };
  }

  private static _giantBombLookup(name: string, platform: number) {
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

  private static _igdbLookup(name: string, platform: number) {
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