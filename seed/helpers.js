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

// const getAdmin = function () {
//   return new Promise((resolve) => {
//     return User.findOne({ email: 'digitaljedi@outlook.com' })
//       .then(admin => {
//         resolve(admin);
//       })
//   });
// }

// const joey = getAdmin();
module.exports.joey = getAdmin();
module.exports.mongoose = mongoose;