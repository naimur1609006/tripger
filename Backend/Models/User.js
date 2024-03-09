const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {Schema} = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    country: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
    },

    about: {
      type: String,
    },

    profession: {
      type: String,
    },

    workplace: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      default: 'user',
    },
    profileImage: {
      type: String, // Assuming you will store the file path
    },
  },
  {timestamps: true},
);

UserSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  user.password = await bcrypt.hash(user.password, 8);
  console.log(user);
  return next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
