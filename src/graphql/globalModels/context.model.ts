interface IUserContext {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

export interface IContext {
  user: IUserContext;
}