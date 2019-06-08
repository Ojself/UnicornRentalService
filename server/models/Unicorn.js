const mongoose = require('mongoose');

const unicornSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The unicorn name is required'],
    minlength: 1
  },
  avatar: {
    type: String,
    default:
      'https://cdn.pixabay.com/photo/2013/10/13/10/09/horse-194999_1280.jpg'
  },
  price: {
    type: Number,
    default: 8
  },
  isAvailable: {
    type: Boolean,
    default: true
  },

  downTime: {
    type: Number,
    default: 15
  },
  /* For future features */
  totalRevenue: {
    type: Number,
    default: 0
  },
  currentCustomer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timeTraveled: {
    type: Date,
    default: 0
  }
});

const Unicorn = mongoose.model('Unicorn', unicornSchema);

module.exports = Unicorn;
