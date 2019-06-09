const mongoose = require('mongoose');

// connect to DB
mongoose.connect(
  'mongodb://localhost:27017/joeyDb',
  { useNewUrlParser: true }
);
// import model
require('../dist/models/User');
const User = mongoose.model('User');

async function getAdmin() {
  const user = await User.findOne({ email: 'digitaljedi@outlook.com' });
  return user;
}

module.exports.mongoose = mongoose;
module.exports.joey = getAdmin();
module.exports.killProcess = function (exit) {
  if (!process.env.ALL || exit) {
    mongoose.connection.close();
  }
};