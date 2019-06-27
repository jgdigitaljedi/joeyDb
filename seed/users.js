const chalk = require('chalk');
const helpers = require('./helpers');
const bcrypt = require('bcrypt');

// setup mongoose
const mongoose = helpers.mongoose;
require('../dist/models/User');
const User = mongoose.model('User');

function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

(function () {
  const me = {
    email: 'digitaljedi@outlook.com',
    name: 'Joey Gauthier',
    admin: true
  };
  User.findOne({ email: me.email }).then(result => {
    if (!result) {
      hashPassword('Jg8675309!')
        .then(hash => {
          me.password = hash;
          const user = new User(me);
          user.createdTimestamp();
          user.updatedTimestamp();
          user.save().then(saved => {
            if (saved) {
              process.exit();
            } else {
              helpers.killProcess(1);
            }
          });
        });
    } else {
      helpers.killProcess();
      process.exit();
    }
  });
})();