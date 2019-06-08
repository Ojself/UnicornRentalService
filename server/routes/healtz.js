const express = require('express');
const { isLoggedIn } = require('../middlewares');
const router = express.Router();
const Unicorn = require('../models/Unicorn');
const User = require('../models/User');

router.get('/', isLoggedIn, (req, res, next) => {
  /* health check */
  /* Databases */
  /* Unicorns available */
  /* Check routes? */

  res.json({
    health: 'All systems operational'
  });
});

/* Not needed */
router.post('/newUnicorn', (req, res, next) => {
  let { name, avatar, price, downtime } = req.body;
  Unicorn.create({ name, avatar, price, downtime })
    .then(unicorn => {
      res.json({
        success: true,
        Unicorn
      });
    })
    .catch(err => next(err));
});

module.exports = router;
