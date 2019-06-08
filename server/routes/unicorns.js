const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares');
const Unicorn = require('../models/Unicorn');
const User = require('../models/User');

/* 
@GET
@UNSECURED
@Lists unicorns and displays it for the client
 */
router.get('/rentals', (req, res, next) => {
  Unicorn.find()
    .then(unicorns => {
      res.json(unicorns);
    })
    .catch(err => next(err));
});

/* 
@POST
@SECURED
@Let's the user rent a unicorn if client is logged in and don't have rented one already.
*/
router.post(
  '/rentals',
  /* isLoggedIn, */ (req, res, next) => {
    /* let { user } = req; */
    let { unicorn } = req.body;
    let { user } = req.body;
    let listUnicorns;
    let currentDate = Date.now();

    Unicorn.find().then(unicorns => {
      listUnicorns = unicorns;
      /* Checks if user chose a unicorn or if he wants the app to choose for him */
      if (!unicorn) {
        /* Gets the first available unicorn. Might lead to over usage of certain unicorns */
        unicorn = unicorns.find(unicorn => unicorn.isAvailable);
        /* Sends message back that ther's no available unicorns if there's no available unicorn*/
        if (!unicorn) {
          res.json({
            success: false,
            message: 'No unicorns available'
          });
        }
      }
    });
    Unicorn.findByIdAndUpdate(unicorn, {
      $set: {
        isAvailable: false,
        currentCustomer: user,
        timeTraveled: currentDate
      }
    })
      .then(unicorn => {
        console.log(unicorn, 'unicorn updated');
      })
      .then(() => {
        User.findByIdAndUpdate(user, {
          $set: {
            currentUnicorn: unicorn
          }
        }).then(() => {
          res.json({
            success: true,
            message: `You rented ${unicorn}, enjoy!`
          });
        });
      })
      .catch(err => console.log('error'));
  }
);

/* 
@PATCH
@SECURED
@Let's the user return the rented unicorn, ensure revenue and resttime for the unicorns
*/

router.patch(
  '/rentals',
  /* isLoggedIn, */ (req, res, next) => {
    /* let { user } = req; */
    let { user } = req.body;
    let unicorn;
    let currentDate = Date.now();
    let newDate;
    let userInfo;
    let unicornInfo;
    let revenue;

    User.findById(user)
      .then(u => {
        userInfo = u;
        unicorn = u.currentUnicorn;
      })
      .then(() => {
        Unicorn.findById(unicorn)
          .then(u => {
            unicornInfo = u;
            newDate = u.timeTraveled;
          })
          .then(() => {
            revenue = calculatePrice(currentDate, newDate);
            userInfo.moneySpent += revenue;
            unicornInfo.totalRevenue += revenue;
            User.findByIdAndUpdate(user, {
              $set: { moneySpent: userInfo.moneySpent },
              $unset: { currentUnicorn: '' }
            })
              .then(user => {
                console.log(`${user} updated`);
              })
              .then(() => {
                /* Ensures that the unicorn gets rest between each customer and info updated*/
                setTimeout(() => {
                  Unicorn.findByIdAndUpdate(unicorn, {
                    $set: {
                      isAvailable: true,
                      totalRevenue: unicornInfo.totalRevenue
                    },
                    $unset: { timeTraveled: 0, currentCustomer: '' }
                  }).then(unicorn => {
                    console.log(
                      `${unicorn.name} well rested for ${
                        unicorn.downTime
                      } minutes`
                    );
                  });
                }, 1000 * 60 * unicornInfo.downTime);
              });
          });
      });

    /* Gets the price of started hour multiplied by the price of given unicorn */
    function calculatePrice(currentDate, newDate) {
      console.log(
        Math.ceil(Math.abs(currentDate - newDate) / 36e5) * unicornInfo.price,
        'total cost this time around'
      );
      return (
        Math.ceil(Math.abs(currentDate - newDate) / 36e5) * unicornInfo.price
      );
    }
  }
);

module.exports = router;
