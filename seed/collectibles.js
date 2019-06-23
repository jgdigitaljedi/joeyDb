(function () {
  const chalk = require('chalk');
  const helpers = require('./helpers');

  // import json file from homeControl project
  const collectibles = require('../../homeControl/server/db/collectibles.json');
  const wlCollectibles = require('../../homeControl/server/db/wlCollectibles.json');

  // setup mongoose
  const mongoose = helpers.mongoose;
  require('../dist/models/Collectible');
  require('../dist/models/Platform');
  const Collectible = mongoose.model('Collectible');
  const Platform = mongoose.model('Platform');

  function makeColl(coll, joey, wl) {
    return {
      user: joey.id,
      name: coll.name,
      company: coll.company === '' ? null : coll.company,
      forPlatforms: coll.associatedConsoles.map(p => p.id),
      associatedGame: coll.associatedGame === '' ? null : coll.associatedGame,
      character: coll.character === '' ? null : coll.character,
      image: coll.image,
      type: coll.type,
      notes: coll.notes === '' ? null : coll.notes,
      pricePaid: coll.pricePaid === '' ? null : coll.pricePaid,
      purchaseDate: coll.purchaseDate === '' ? null : coll.purchaseDate,
      howAcquired: coll.howAcquired === '' ? null : coll.howAcquired,
      quantity: !coll.quantity ? 1 : coll.quantity,
      type: coll.type,
      wishlist: wl,
      officialLicensed: coll.officialLicensed
    };
  }

  function seedAcc() {
    return new Promise((resolve, reject) => {
      helpers.joey.then(result => {
        const joey = result;

        Collectible.deleteMany({}, err => {
          if (err) {
            throw new Error(err.message);
          } else {
            collectibles.forEach((coll, index) => {
              const mColl = makeColl(coll, joey, false);
              const newColl = new Collectible(mColl);
              newColl.createdTimestamp();
              newColl.updatedTimestamp();
              newColl.save().then(saved => {
                if (saved) {
                  console.log(chalk.cyan.bold(`Added ${coll.name}`));
                  if ((index + 1) === collectibles.length) {
                    console.log(chalk.green.bold(`ADDED ALL COLLECTIBLES SUCCESSFULLY`));
                  }
                }
              });
            });
            wlCollectibles.forEach((coll, index) => {
              const mColl = makeColl(coll, joey, true);
              const newColl = new Collectible(mColl);
              newColl.createdTimestamp();
              newColl.updatedTimestamp();
              newColl.save().then(saved => {
                if (saved) {
                  console.log(chalk.cyan.bold(`Added ${coll.name}`));
                  if ((index + 1) === wlCollectibles.length) {
                    console.log(chalk.green.bold(`ADDED ALL WISHLIST COLLECTIBLES SUCCESSFULLY`));
                    resolve(true);
                  }
                }
              });
            });
          }
        });
      });
    });
  }

  seedAcc()
    .then(result => {
      helpers.killProcess();
      process.exit();
    })
    .catch(error => {
      throw new Error(error);
    });
})();