import User from '../../../models/User';
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
      async gameLookup(_, { name, platform }, { user }) {
        if (user) {
          const urlName = encodeURI(name);
          // const gbData = await that._giantBombLookup(urlName, platform);
          const gbData = await that._igdbLookup(name, platform);
          return gbData;
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

  private static _giantBombLookup(name, platform) {
    return axios
      .get(
        // `https://api.giantbomb.com/games/?api_key=${gbKey}&filter=name:${name},platforms:${platform}&format=json`
        `https://api.giantbomb.com/games/?api_key=${gbKey}&filter=name:${name}&format=json`
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

  private static _igdbLookup(name, platform) {
    return axios({
      url: "https://api-v3.igdb.com/games",
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'user-key': process.env.IGDBV3KEY
      },
      data: `fields *; search name = "${name}"; where game.platforms = ${platform}`
    });
    // const requestOptions = {
    //   // queryMethod: 'body',
    //   // method: 'POST',
    //   baseURL: 'https://api-v3.igdb.com',
    //   headers: {
    //     'Accept': 'application/json',
    //     'user-key': process.env.IGDBV3KEY
    //   },
    //   // data: `search "${name}"; fields *; limit 50; where game.platforms = ${platform}; offset 0;`
    // };
    // // return apicalypse(requestOptions).request('/games');
    // return apicalypse(requestOptions)
    //   // .fields(`age_ratings,alternative_names,category,cover,dlcs,first_release_date,game_engines,genres.name,name,platforms,release_dates,summary`)
    //   .fields('*')
    //   // .limit(50)
    //   .search(name)
    //   .where(`platform = ${platform}`)
    //   .request('/games');
  }
}