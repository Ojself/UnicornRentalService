const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: String,
    password: String,
    moneySpent: { type: Number, default: 0 },
    currentUnicorn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unicorn'
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
