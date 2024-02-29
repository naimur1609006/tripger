const mongoose = require('mongoose');
const {Schema} = mongoose;

// Define schema for Member
const MemberSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  additionalAmounts: {
    type: [Number], // Array to store additional amounts
    default: [0],
  },
});

const TripSchema = new Schema(
  {
    tripName: {
      type: String,
      required: true,
    },
    tripLocation: {
      type: String,
      required: true,
    },
    startingFrom: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    members: {
      type: [MemberSchema],
      required: true,
    },
    userInfo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    role: {
      type: String,
      required: true,
      default: 'user',
    },
  },
  {timestamps: true},
);

const Trip = mongoose.model('Trip', TripSchema);

module.exports = Trip;
