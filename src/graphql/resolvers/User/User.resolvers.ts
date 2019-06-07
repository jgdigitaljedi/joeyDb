import User from '../../../models/User';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { IUserDocument, IUser } from './User.model';
import { AuthenticationError, ForbiddenError, UserInputError, ApolloError } from 'apollo-server-express';
import { IContext } from '../../globalModels/context.model';
import { Helpers } from '../../../util/helpers';
import Platform from '../../../models/Platform';
import AVDevice from '../../../models/AVDevice';

const logger = Helpers.apiLogger;

export class UserClass {
  _queries;
  _mutations;
  constructor() {
    const that = this;
    this._queries = {
      async me(_, args: any[], { user }: IContext): Promise<IUser> {
        // make sure user is logged in
        if (!user) {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
        // user is authenticated
        try {
          const found = await User.find({ _id: user.id });
          return found[0];
        } catch (error) {
          logger.write(`User.queries.me ERROR: ${error}`, 'error');
          throw new ApolloError(error);
        }
      },
      async users(_, args: any[], { user }: IContext): Promise<IUser[]> {
        if (user && user.id && user.admin) {
          try {
            const users = await User.find({});
            return users;
          } catch (error) {
            logger.write(`User.queries.users ERROR: ${error}`, 'error');
            throw new ApolloError('Error fetching users list!');
          }
        } else {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
      }
    };

    this._mutations = {
      async editUser(root, args, { user }: IContext): Promise<IUser> {
        if (user) {
          try {
            const usr = await User.findOne({ _id: user.id });
            const keys = Object.keys(args);
            if (keys.indexOf('password') >= 0) {
              usr.password = await that._changePassword(args.password);
            }
            keys.forEach(key => {
              if (key !== 'password') {
                usr[key] = args[key];
              }
            });
            usr.updatedTimestamp();
            const saved: IUserDocument = await usr.save();
            return saved;
          } catch (error) {
            logger.write(`User.mutations.editUser ERROR: ${error}`, 'error');
            throw new ApolloError(error);
          }
        } else {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
      },
      async deleteMe(_, args, { user }: IContext): Promise<IUser> {
        if (user) {
          try {
            const usr = await User.findOne({ _id: user.id });
            const removed = await usr.remove();
            const userPlatforms = await Platform.find({ userId: user.id }).remove().exec();
            const userAVDevices = await AVDevice.find({ userId: user.id }).remove().exec();
            return removed;
          } catch (error) {
            logger.write(`User.mutations.deleteMe ERROR: ${error}`, 'error');
            throw new ApolloError(error);
          }
        }
      },
      async deleteUser(_, args, { user }: IContext): Promise<IUser> {
        if (user && user.id && user.admin) {
          try {
            const usr = await User.findOne({ [args.key]: [args.value] });
            if (usr) {
              const removed = await usr.remove();
              const userPlatforms = await Platform.find({ userId: user.id }).remove().exec();
              const userAVDevices = await AVDevice.find({ userId: user.id }).remove().exec();
              return removed;
            } else {
              throw new ForbiddenError(Helpers.forbiddenMessage);
            }
          } catch (error) {
            logger.write(`User.mutations.deleteUser ERROR: ${error}`, 'error');
            throw new ApolloError(error);
          }
        } else {
          throw new ForbiddenError(Helpers.forbiddenMessage);
        }
      },
      async signup(_, { name, email, password }: IUser): Promise<String> {
        try {
          const usr = new User();
          usr.name = name;
          usr.email = email;
          usr.password = await that._changePassword(password);
          usr.createdTimestamp();
          usr.updatedTimestamp();
          usr.isAdmin(email);
          const user: IUserDocument = await usr.save();
          // return json web token
          return that._jwtSign(user);
        } catch (error) {
          logger.write(`User.mutations.signup ERROR: ${error}`, 'error');
          throw new ApolloError(error);
        }
      },
      async login(_, { email, password }: IUser): Promise<String> {
        const user = await User.findOne({ email });

        if (!user) {
          throw new AuthenticationError(Helpers.authMessage);
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
          throw new AuthenticationError(Helpers.authMessage);
        }

        return that._jwtSign(user);
      }
    };
  }

  get queries() {
    return this._queries;
  }

  get mutations() {
    return this._mutations;
  }

  private _jwtSign(user): String {
    return jsonwebtoken.sign(
      { id: user._id, email: user.email, admin: user.admin },
      process.env.JOEYDBSECRET,
      { expiresIn: '1d' }
    );
  }

  private _changePassword(password) {
    return bcrypt.hash(password, 10);
  }
}