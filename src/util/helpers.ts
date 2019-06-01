

export class Helpers {
  public static forbiddenMessage = 'Invalid or no token in request. You do not have permission to do that! Please login first.';
  public static authMessage = 'User not found or password incorrect! Please try again.';

  removeBreaks(str: string): string {
    return str.replace(/\n|\r|\\n/g, '');
  }

  jsonToString(obj: object): string {
    const str = JSON.stringify(obj);
    return this.removeBreaks(str);
  }
}