import User from '../../../models/User';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { IUserDocument, IUser } from './User.model';
import { AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-express';
import { IContext } from '../../globalModels/context.model';

export class UserClass {
  _queries;
  _mutations;
  constructor() {
    const that = this;
    this._queries = {
      async me(_, args: any[], { user }: IContext): Promise<IUser> {
        // make sure user is logged in
        if (!user) {
          throw new ForbiddenError('You are not authenticated!');
        }
        // user is authenticated
        try {
          const found = await User.find({ id: user.id });
          return found[0];
        } catch (error) {
          throw new UserInputError('Something in the request is invalid!');
        }
      },
      async users(_, args: any[], { user }: IContext): Promise<IUser[]> {
        if (user && user.id && user.admin) {
          const users = await User.find({});
          return users;
        } else {
          throw new ForbiddenError('Invalid token! You do not have permission to do that!');
        }
      }
    };

    this._mutations = {
      async editUser(root, args, { user }: IContext): Promise<IUser> {
        if (user) {
          try {
            const usr = await User.findOne({ id: user.id });
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
            throw new UserInputError('Something went wrong!');
          }
        } else {
          throw new ForbiddenError('Invalid token! You do not have permission to do that!');
        }
      },
      async deleteMe(_, args, { user }: IContext): Promise<IUser> {
        if (user) {
          try {
            const usr = await User.findOne({ id: user.id });
            const removed = await usr.remove();
            return removed;
          } catch (error) {
            throw new UserInputError('Something went wrong!');
          }
        }
      },
      async deleteUser(_, args, { user }: IContext): Promise<IUser> {
        if (user && user.id && user.admin) {
          try {
            const usr = await User.findOne({ [args.key]: [args.value] });
            if (usr) {
              const removed = await usr.remove();
              return removed;
            } else {
              throw new UserInputError('Something went wrong!');
            }
          } catch (error) {
            throw new UserInputError('Something went wrong!');
          }
        } else {
          throw new ForbiddenError('Invalid token! You do not have permission to do that!');
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
          return error;
        }
      },
      async login(_, { email, password }: IUser): Promise<String> {
        const user = await User.findOne({ email });

        if (!user) {
          throw new AuthenticationError('User not found or password incorrect! Please try again.');
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
          throw new AuthenticationError('User not found or password incorrect! Please try again.');
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
      { id: user.id, email: user.email, admin: user.admin },
      process.env.JOEYDBSECRET,
      { expiresIn: '1d' }
    );
  }

  private _changePassword(password) {
    return bcrypt.hash(password, 10);
  }
}