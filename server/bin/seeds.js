const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Seeds file that remove all users and create 2 new users and 4 unicorns

// $ node bin/seeds.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Unicorn = require('../models/Unicorn');

const bcryptSalt = 10;

require('../configs/database');

let unicorns = [
  {
    name: 'Pinky Pie',
    avatar: 'https://imgur.com/E5QX343.png'
  },
  {
    name: 'Rainbow Dash',
    avatar: 'https://imgur.com/SvUj5V6.png'
  },
  {
    name: 'Fluttershy',
    avatar: 'https://imgur.com/kBNDehG.png'
  },
  {
    name: 'Twilight Sparkle',
    avatar: 'https://imgur.com/bbFlHZb.png',
    downTime: 30
  }
];

let users = [
  {
    username: 'max',
    password: bcrypt.hashSync('max', bcrypt.genSaltSync(bcryptSalt))
  },
  {
    username: 'erika',
    password: bcrypt.hashSync('erika', bcrypt.genSaltSync(bcryptSalt))
  }
];

Unicorn.deleteMany()
  .then(() => {
    return Unicorn.create(unicorns);
  })
  .then(unicornsCreated => {
    console.log(
      `${unicornsCreated.length} unicorns created with the following id:`
    );
    console.log(unicornsCreated.map(u => u._id));
  })
  .then(() => {
    User.deleteMany()
      .then(() => {
        return User.create(users);
      })
      .then(usersCreated => {
        console.log(
          `${usersCreated.length} users created with the following id:`
        );
        console.log(usersCreated.map(u => u._id));
      })
      .then(() => {
        mongoose.disconnect();
      })
      .catch(err => {
        mongoose.disconnect();
        throw err;
      });
  });
