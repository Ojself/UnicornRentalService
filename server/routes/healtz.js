const express = require('express');
const { isLoggedIn } = require('../middlewares');
const router = express.Router();
const mongoose = require('mongoose');

/* 
@GET
@SECURED //  NON-ROLE-BASED
@Let's any logged in user do a health check of the server
 */

router.get('/', isLoggedIn, (req, res, next) => {
  let dbStatus;
  let upTime = process.uptime();
  let memoryUsage = process.memoryUsage();
  let platform = process.platform;

  mongoose.connection.readyState ? (dbStatus = 'UP') : (dbStatus = 'DOWN');

  res.status(200).json({
    status: 'UP',
    dbStatus,
    upTime,
    memoryUsage,
    platform
  });
});

module.exports = router;
