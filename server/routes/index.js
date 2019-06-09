const express = require('express');
const { isLoggedIn } = require('../middlewares');
const router = express.Router();
const User = require('../models/User');

router.get('/user', isLoggedIn, async (req, res, next) => {
  const user = await User.findById(req.user._id);
  user.password = undefined;
  user.created_at = undefined;
  user.updated_at = undefined;
  res.json({
    user
  });
});

module.exports = router;
