import User from '../../../models/User';
import { IGameDocument } from './Game.model';
import { ForbiddenError, UserInputError } from 'apollo-server-express';
import { IContext } from '../../globalModels/context.model';

export class GameClass {
  public static queries() {
    return {};

  }
  public static mutations() {
    return {};
  }
}