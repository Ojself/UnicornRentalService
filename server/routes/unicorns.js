const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares');
const { calculatePrice } = require('../utils/helpers');
const Unicorn = require('../models/Unicorn');
const User = require('../models/User');

/* 
@GET
@SECURED
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
@Let's the user rent a unicorn.
*/

router.post('/rentals', isLoggedIn, async (req, res, next) => {
  let user = req.user._id;
  let { unicorn } = req.body;
  let currentDate = Date.now();
  let listUnicorns = await Unicorn.find();
  let userInfo = await User.findById(user);

  /* Checks if the user is trying to rent more than one unicorn at a time */
  if (userInfo.currentUnicorn) {
    res.status(400).json({
      success: false,
      message: 'Please return your current unicorn before renting a new one'
    });
    return;
  }

  /* Checks if user is trying to rent a unicorn that doesn't exist */
  if (!listUnicorns.some(u => u.isAvailable)) {
    res.status(404).json({
      success: false,
      message: 'No unicorns available'
    });
    return;
  }

  /* Checks if user is trying to rent a unicorn that doesn't exist */
  if (listUnicorns.some(u => JSON.stringify(u._id) === unicorn)) {
    res.status(404).json({
      success: false,
      message: 'This unicorn does not exist'
    });
    return;
  }

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
      return;
    }
  }

  /* Updates the unicorn to make her unavailable for other users */
  await Unicorn.findByIdAndUpdate(unicorn, {
    $set: {
      isAvailable: false,
      currentCustomer: user,
      timeTraveled: currentDate
    }
  });

  /* Updates the user with the unicorn that has been rented */
  await User.findByIdAndUpdate(user, {
    $set: {
      currentUnicorn: unicorn
    }
  });
  await res.status(200).json({
    success: true,
    message: `You rented ${unicorn}, enjoy!`
  });
});

/* 
@PATCH
@SECURED
@Let's the user return the rented unicorn, ensure revenue and resttime for the unicorns
*/

router.patch('/rentals', isLoggedIn, async (req, res, next) => {
  let user = req.user._id;
  let userInfo = await User.findById(user);
  let unicorn = userInfo.currentUnicorn;
  let unicornInfo = await Unicorn.findById(unicorn);
  let revenue = calculatePrice(
    Date.now(),
    unicornInfo.timeTraveled,
    unicornInfo.price
  );

  /* Checks if user has a unicorn to return */
  if (!userInfo.currentUnicorn) {
    res.status(400).json({
      success: false,
      message: 'You have nothing to return'
    });
    return;
  }

  /* calculates revenue */
  userInfo.moneySpent += revenue;
  unicornInfo.totalRevenue += revenue;

  /* Updates user */
  await User.findByIdAndUpdate(user, {
    $set: { moneySpent: userInfo.moneySpent },
    $unset: { currentUnicorn: '' }
  });

  /* returns 204 */
  await res.status(204).json({
    success: true,
    message: `Thank you for using our services, you paid ${revenue}$. ${
      unicornInfo.name
    } needs ${unicornInfo.downTime} minutes to rest`
  });

  /* Ensures that the unicorn gets rest between each customer and info updated*/
  /* note to dev: save to datebase? */
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
