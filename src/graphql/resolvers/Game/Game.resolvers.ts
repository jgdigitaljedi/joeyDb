import User from '../../../models/User';
import { IGameDocument } from './Game.model';
import { ForbiddenError, UserInputError } from 'apollo-server-express';
import { IContext } from '../../globalModels/context.model';
import axios from 'axios';

const gbKey = process.env.JGBKEY;

export class GameClass {
  public static queries() {
    const that = this;
    return {
      async gameLookup(_, { name, platform }, { user }) {
        if (user) {
          const urlName = encodeURI(name);
          const gbData = await that._giantBombLookup(urlName, platform);
          return gbData;
        }
      }
    };
  }
  public static mutations() {
    return {};
  }

  private static _giantBombLookup(name, platform) {
    axios
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
          return SpeechRecognitionResultList;
        }
      })
      .catch(error => {
        return error;
      });
  }
}