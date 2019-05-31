

export class Helpers {
  removeBreaks(str: string): string {
    return str.replace(/\n|\r|\\n/g, '');
  }

  jsonToString(obj: object): string {
    const str = JSON.stringify(obj);
    return this.removeBreaks(str);
  }
}