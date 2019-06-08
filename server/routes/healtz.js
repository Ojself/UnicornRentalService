const express = require('express');
const { isLoggedIn } = require('../middlewares');
const router = express.Router();
const Unicorn = require('../models/Unicorn');
const User = require('../models/User');

/* 
@GET
@SECURED
@Hacker
https://inadarei.github.io/rfc-healthcheck/#rfc.section.3
 */

router.get('/', isLoggedIn, (req, res, next) => {
  /* health check */
  /* Databases */
  /* Unicorns available */
  /* Check routes? */

  res.json({
    health: 'All systems operational'
  });
});

module.exports = router;
