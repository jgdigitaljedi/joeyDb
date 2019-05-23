import User from '../../../models/User';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { IUserDocument } from './User.model';
import { AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-express';
import { IContext } from '../../globalModels/context.model';

const queries = {
  async me(_, args, { user }: IContext) {
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
  async users(_, args, { user }: IContext) {
    if (user && user.id) {
      const users = await User.find({});
      return users;
    } else {
      throw new ForbiddenError('Invalid token! You must be logged in to do that!');
    }
  }
};

const mutations = {
  editUser: (root, { id, name, email }) => {
    return new Promise((resolve, reject) => {
      User.findOneAndUpdate({ id }, { $set: { name, email } }).exec(
        (err, res) => {
          err ? reject(err) : resolve(res);
        }
      );
    });
  },
  deleteUser: (root, args) => {
    return new Promise((resolve, reject) => {
      User.findOneAndRemove(args).exec((err, res) => {
        err ? reject(err) : resolve(res);
      });
    });
  },
  async signup(_, { name, email, password }) {
    try {
      const user: IUserDocument = await User.create({
        name,
        email,
        password: await bcrypt.hash(password, 10)
      });
      // return json web token
      return jsonwebtoken.sign(
        { id: user.id, email: user.email },
        process.env.JOEYDBSECRET,
        { expiresIn: '1d' }
      );
    } catch (error) {
      return error;
    }
  },
  async login(_, { email, password }) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new AuthenticationError('User not found or password incorrect! Please try again.');
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new AuthenticationError('User not found or password incorrect! Please try again.');
    }

    // return json web token
    return jsonwebtoken.sign(
      { id: user.id, email: user.email },
      process.env.JOEYDBSECRET,
      { expiresIn: '1d' }
    );
  }
};

export const UserQuery = queries;
export const UserMutation = mutations;