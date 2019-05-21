// The User schema.
// import User from '../User';
const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

export default {
  Query: {
    async me(_, args, { user }) {
      // make sure user is logged in
      if (!user) {
        throw new Error('You are not authenticated!')
      }

      // user is authenticated
      return await User.findById(user.id)
    },
    async users(_) {
      const users = await User.find({});
      return users;
    }
  },
  Mutation: {
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
        const user = await User.create({
          name,
          email,
          password: await bcrypt.hash(password, 10)
          // password: password
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
        throw new Error('No user with that email');
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        throw new Error('Incorrect password');
      }

      // return json web token
      return jsonwebtoken.sign(
        { id: user.id, email: user.email },
        process.env.JOEYDBSECRET,
        { expiresIn: '1d' }
      );
    }
  }
};