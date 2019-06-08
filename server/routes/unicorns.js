const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares');
const { calculatePrice } = require('../utils/helpers');
const Unicorn = require('../models/Unicorn');
const User = require('../models/User');

/* 
@GET
@UNSECURED
@Lists unicorns and displays it for the client
 */
router.get('/rentals', async (req, res, next) => {
  try {
    const unicorns = await Unicorn.find();
    res.json(unicorns);
  } catch (err) {
    next(err);
  }
});

/* 
@POST
@SECURED
@Let's the user rent a unicorn if client is logged in and don't have rented one already.
*/

router.post('/rentals', async (req, res, next) => {
  let user = req.user._id;
  let { unicorn } = req.body;
  let currentDate = Date.now();
  let listUnicorns = await Unicorn.find();

  /* Checks if user chose a unicorn or if he wants the app to choose for him */
  if (unicorn === 'selectForMe') {
    /* Gets the first available unicorn. Might lead to over usage of certain unicorns */
    unicorn = listUnicorns.find(unicorn => unicorn.isAvailable);
    /* Sends message back that ther's no available unicorns if there's no available unicorn*/
    if (unicorn === 'selectForMe') {
      res.json({
        success: false,
        message: 'No unicorns available'
      });
    }
  }
  await Unicorn.findByIdAndUpdate(unicorn, {
    $set: {
      isAvailable: false,
      currentCustomer: user,
      timeTraveled: currentDate
    }
  });
  await User.findByIdAndUpdate(user, {
    $set: {
      currentUnicorn: unicorn
    }
  });
  res.json({
    success: true,
    message: `You rented ${unicorn}, enjoy!`
  });
});

/* 
@PATCH
@SECURED
@Let's the user return the rented unicorn, ensure revenue and resttime for the unicorns
*/

/* 
Clean up nested promises
Async Await
Utliity file for function
 */

router.patch('/rentals', async (req, res, next) => {
  /* let { user } = req; */
  let { user } = req.body;
  let currentDate = Date.now();
  let userInfo = await User.findById(user);
  let unicorn = userInfo.currentUnicorn;
  let unicornInfo = await Unicorn.findById(unicorn);
  let newDate = unicornInfo.timeTraveled;
  let revenue = calculatePrice(currentDate, newDate, unicornInfo.price);

  userInfo.moneySpent += revenue;
  unicornInfo.totalRevenue += revenue;

  await User.findByIdAndUpdate(user, {
    $set: { moneySpent: userInfo.moneySpent },
    $unset: { currentUnicorn: '' }
  });

  /* Ensures that the unicorn gets rest between each customer and info updated*/
  setTimeout(() => {
    Unicorn.findByIdAndUpdate(unicorn, {
      $set: {
        isAvailable: true,
        totalRevenue: unicornInfo.totalRevenue
      },
      $unset: { timeTraveled: 0, currentCustomer: '' }
    });
  }, 1000 * 60 * unicornInfo.downTime);
});

module.exports = router;
