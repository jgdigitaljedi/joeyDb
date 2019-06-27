import { ApiLogger } from "./logger";
import moment from 'moment';

export class Helpers {
  public static forbiddenMessage = 'Invalid or no token in request. You do not have permission to do that! Please login first.';
  public static authMessage = 'User not found or password incorrect! Please try again.';
  public static passwordMessage = 'Password must be a minimum of 8 characters and contain at least 1 uppsercase letter, 1 lowecase letter, 1 number, and 1 special character!';
  public static getTimestamp = function () {
    return moment().format(process.env.DATE_FORMAT);
  }
  public static urlTest = function (url) {
    return url ? /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi.test(url) : true;
  }
  public static emailTest = function (email) {
    return email ? /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) : false;
  }
  public static passwordTest = function (password) {
    return password ? /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/.test(password) : false;
  }

  private static _apiLogger = new ApiLogger();

  constructor() { }

  static get apiLogger() {
    return this._apiLogger;
  }

  removeBreaks(str: string): string {
    return str.replace(/\n|\r|\\n/g, '');
  }

  jsonToString(obj: object): string {
    const str = JSON.stringify(obj);
    return this.removeBreaks(str);
  }
}