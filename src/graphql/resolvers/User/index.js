// The User schema.
import User from '../User';
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

export default {
  Query: {
    login(_, { email, password }) {
      const user = async function () {
        try {
          return await User.findOne({ where: { email } });
        } catch (error) {
          console.log('could not find user', error);
          return await null;
        }
      }

      if (!user) {
        throw new Error('No user with that email');
      }

      const valid = async function () {
        try {
          return await bcrypt.compare(password, user.password);
        } catch (error) {
          console.log('bcrypt error', error);
          return await null;
        }
      }

      if (!valid || !user) {
        throw new Error('Incorrect username or password!');
      }

      // return json web token
      return jsonwebtoken.sign({
        id: user.id,
        email: user.email
      }, process.env.JOEYDBSECRET, { expiresIn: '1y' });
    },
    user: (root, args) => {
      return new Promise((resolve, reject) => {
        User.findOne(args).exec((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    },
    users: () => {
      return new Promise((resolve, reject) => {
        User.find({})
          .populate()
          .exec((err, res) => {
            err ? reject(err) : resolve(res);
          });
      });
    }
  },
  Mutation: {
    addUser: (root, { id, name, email }) => {
      const newUser = new User({ id, name, email });

      return new Promise((resolve, reject) => {
        newUser.save((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    },
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
    }
  }
};