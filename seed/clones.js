(function () {
  const chalk = require('chalk');
  const helpers = require('./helpers');

  // import json file from homeControl project
  const clones = require('../../homeControl/server/db/clones.json');
  const wlClones = require('../../homeControl/server/db/wlClones.json');

  // setup mongoose
  const mongoose = helpers.mongoose;
  require('../dist/models/Clone');
  const Clone = mongoose.model('Clone');

  function makeClone(clone, joey, wishlist) {
    const ce = clone.consolesEmulated.split(',') || [];
    return {
      user: joey._id,
      wishlist,
      name: clone.name,
      company: clone.company,
      image: clone.image,
      platformsEmulated: ce.map(c => {
        return { igdbId: 9999, name: c };
      }),
      notes: '',
      pricePaid: clone.pricePaid,
      purchaseDate: clone.purchaseDate,
      howAcquired: null,
      officialLicensed: false,
      numberGamesIncluded: clone.gamesIncludedAmount,
      numberGamesAdded: clone.gamesAddedNumber,
      hacked: clone.hacked,
      wirelessControllers: clone.wireless,
      maxNumberPlayers: clone.maxPlayers,
      connectedBy: clone.connectedBy,
      addons: clone.addons,
      hdOutput: clone.hd,
      upscaler: clone.upscaler,
      takesOriginalControllers: clone.takesOriginalControllers
    };
  }

  function seedClones() {
    return new Promise((resolve, reject) => {
      helpers.joey.then(result => {
        const joey = result;

        // remove previous entries
        Clone.deleteMany({}, err => {
          if (!err) {
            clones.forEach((clone, index) => {
              const mClone = makeClone(clone, joey, false);
              const newClone = new Clone(mClone);
              newClone.createdTimestamp();
              newClone.updatedTimestamp();
              newClone.save().then(saved => {
                if (saved) {
                  console.log(chalk.cyan.bold(`Added ${clone.name}`));
                  if ((index + 1) === clones.length) {
                    console.log(chalk.green.bold(`ADDED ALL CLONES SUCCESSFULLY`));
                  }
                }
              });
            });
            wlClones.forEach((clone, index) => {
              const mClone = makeClone(clone, joey, true);
              const newClone = new Clone(mClone);
              newClone.createdTimestamp();
              newClone.updatedTimestamp();
              newClone.save().then(saved => {
                if (saved) {
                  console.log(chalk.cyan.bold(`Added ${clone.name}`));
                  if ((index + 1) === wlClones.length) {
                    console.log(chalk.green.bold(`ADDED ALL WISHLIST CLONES SUCCESSFULLY`));
                    resolve(true);
                  }
                }
              });
            });
          } else {
            console.log(chalk.red.bold(`An error occurred seeding clones: `, err));
          }
        });
      });
    });
  }

  seedClones()
    .then(result => {
      helpers.killProcess(true);
    })
    .catch(error => {
      throw new Error(error);
    });
})();