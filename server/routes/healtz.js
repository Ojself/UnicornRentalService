const express = require('express');
const { isLoggedIn } = require('../middlewares');
const router = express.Router();
const Unicorn = require('../models/Unicorn');
const User = require('../models/User');

/* 
@GET
@SECURED //  NON-ROLE-BASED
@Hacker unfriendly
https://inadarei.github.io/rfc-healthcheck/#rfc.section.3
 */

router.get('/', isLoggedIn, (req, res, next) => {
  let upTime = process.uptime();
  let memoryUsage = process.memoryUsage();

  res.json({
    status: 'UP'
  });
});

module.exports = router;
