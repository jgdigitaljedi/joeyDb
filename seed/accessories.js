(function () {
  const chalk = require('chalk');
  const helpers = require('./helpers');

  // import json file from homeControl project
  const accessories = require('../../homeControl/server/db/gameAcc.json');
  const wlAccessories = require('../../homeControl/server/db/wlAccessories.json');

  // setup mongoose
  const mongoose = helpers.mongoose;
  require('../dist/models/Accessory');
  require('../dist/models/Platform');
  const Accessory = mongoose.model('Accessory');
  const Platform = mongoose.model('Platform');

  function makeAcc(acc, plat, joey, wl) {
    return {
      user: joey.id,
      name: acc.name,
      company: acc.company,
      forPlatforms: plat.map(p => p._id),
      forClones: null,
      image: acc.image,
      type: acc.type,
      notes: acc.notes,
      pricePaid: acc.pricePaid,
      purchaseDate: acc.purchaseDate,
      howAcquired: acc.howAcquired,
      officialLicensed: acc.officialLicensed
    };
  }

  function seedAcc() {
    return new Promise((resolve, reject) => {
      helpers.joey.then(result => {
        const joey = result;

        Accessory.deleteMany({}, err => {
          if (err) {
            throw new Error(err.message);
          } else {
            Platform.find({}, (err, platforms) => {
              accessories.forEach((acc, index) => {
                const plat = platforms.filter(plat => plat.igdbId === acc.forConsoleId);
                const mAcc = makeAcc(acc, plat, joey, false);
                const newAcc = new Accessory(mAcc);
                newAcc.createdTimestamp();
                newAcc.updatedTimestamp();
                newAcc.save().then(saved => {
                  if (saved) {
                    console.log(chalk.cyan.bold(`Added ${acc.name}`));
                    if ((index + 1) === accessories.length) {
                      console.log(chalk.green.bold(`ADDED ALL ACCESSORIES SUCCESSFULLY`));
                    }
                  }
                });
              });
              wlAccessories.forEach((acc, index) => {
                const plat = platforms.filter(plat => plat.igdbId === acc.forConsoleId);
                const mAcc = makeAcc(acc, plat, joey, true);
                const newAcc = new Accessory(mAcc);
                newAcc.createdTimestamp();
                newAcc.updatedTimestamp();
                newAcc.save().then(saved => {
                  if (saved) {
                    console.log(chalk.cyan.bold(`Added ${acc.name}`));
                    if ((index + 1) === wlAccessories.length) {
                      console.log(chalk.green.bold(`ADDED ALL WISHLIST ACCESSORIES SUCCESSFULLY`));
                      resolve(true);
                    }
                  }
                });
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