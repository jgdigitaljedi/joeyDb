interface IUserContext {
  id: string;
  email: string;
  admin: boolean;
  iat: number;
  exp: number;
}

export interface IContext {
  user: IUserContext;
}