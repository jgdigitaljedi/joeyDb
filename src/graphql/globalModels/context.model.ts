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

export interface IId {
  id: string;
}

export interface IGetReq {
  id?: string;
  wl?: string;
  platform?: string;
}