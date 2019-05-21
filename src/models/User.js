import mongoose from 'mongoose';

// Create the User Schema.
const UserSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    auto: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', UserSchema);
// var fetchData = () => {
//   return User.find()
// };

// export default User;
module.exports = User;