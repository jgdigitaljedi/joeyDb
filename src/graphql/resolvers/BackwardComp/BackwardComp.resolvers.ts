import { ForbiddenError, UserInputError, ApolloError } from 'apollo-server-express';
import { IContext, IId, IGetReq } from '../../globalModels/context.model';
import { Helpers } from '../../../util/helpers';
import BackwardComp from '../../../models/BackwardComp';
import { IBackwardCompDocument, IBackwardComp } from './BackwardComp.model';
import axios from 'axios';
import cheerio from 'cheerio';
import originalToThreeSixty from '../../../static/xboxToXboxThreeSixty';

const logger = Helpers.apiLogger;

export class BackwardCompClass {
  _queries;
  _mutations;
  bcOnXboxThreeSixty = 'https://en.wikipedia.org/wiki/List_of_Xbox_games_compatible_with_Xbox_360';
  bcOnXboxOne = 'https://en.wikipedia.org/wiki/List_of_backward_compatible_games_for_Xbox_One';

  constructor() {
    const that = this;
    this._queries = {
      async tsBcList(_, args, { user }: IContext) {

      },
      async bcList(_, { id }: IGetReq, { user }: IContext): Promise<IBackwardCompDocument[]> {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        try {
          const bc = await BackwardComp.find({});
          return bc;
        } catch (error) {
          logger.write(`BackwardComp.queries.bcList ERROR: ${error}`, 'error');
          throw new ApolloError(error);
        }
      }
    };

    this._mutations = {
      async bcListUpdate(_, { id }: IGetReq, { user }: IContext) {
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        try {
          const scraped = await that._getListHtml(that.bcOnXboxOne);
          const originalParsed = await that._parseRows(scraped.rows.original, scraped.$, 7);
          const tsParsed = await that._parseRows(scraped.rows.ts, scraped.$, 11);
          console.log('original', originalParsed);
          console.log('ts', tsParsed);
          return true;
        } catch (error) {
          logger.write(`BackwardComp.mutations.bcListUpdate ERROR: ${error}`, 'error');
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

  private _getListHtml(url) {
    return axios.get(url)
      .then(response => {
        if (response.status === 200) {
          const html = response.data;
          const $ = cheerio.load(html);
          const rows = { original: $('.wikitable.sortable').filter(i => i === 1).find('tbody').find('tr'), ts: $('.wikitable.sortable').filter(i => i === 0).find('tbody').find('tr') };
          return { rows, $ };
        }
      })
  }

  private _parseRows(rows, $, notesIndex) {
    const rLast = rows.length - 1;
    return new Promise((resolve, reject) => {
      let result = [];
      $(rows).each((index, element) => {
        if (index > 0) {
          const rowData = $(element).text().split('\n');
          const game = rowData[1];
          const issues = rowData[notesIndex];

          // create json object turning notes into an array based on the fact that wiki seems to list each issue as a sentence in a string
          const entry = {
            game,
            notes: (!issues || issues === '') ? null : issues.split('.').map(i => i.trim()).filter(i => i !== '' && i[0] !== '[')
          };
          result.push(entry);
        }
        if (index === rLast) {
          resolve(result);
        }
      });
    });
  }
}