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
  require('../dist/models/Clone');
  const Accessory = mongoose.model('Accessory');
  const Platform = mongoose.model('Platform');
  const Clone = mongoose.model('Clone');

  function makeAcc(acc, plat, clone, joey, wl) {
    const imageTest = acc.image ? /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi.test(acc.image) : false;
    return {
      user: joey.id,
      name: acc.name,
      company: acc.company,
      forPlatforms: plat.map(p => p._id),
      forClones: clone ? clone.map(c => c._id) : null,
      image: imageTest ? acc.image : null,
      type: acc.type,
      notes: acc.notes,
      pricePaid: acc.pricePaid,
      purchaseDate: acc.purchaseDate,
      howAcquired: acc.howAcquired,
      officialLicensed: acc.officialLicensed,
      wishlist: wl
    };
  }

  async function getClones() {
    return await Clone.find({});
  }

  function seedAcc(clones) {
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
                const clone = acc.forClone ? clones.filter(c => c.name === acc.forConsoleName) : null;
                const mAcc = makeAcc(acc, plat, clone, joey, false);
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
                const clone = acc.forClone ? clones.filter(c => c.name === acc.forConsoleName) : null;
                const mAcc = makeAcc(acc, plat, clone, joey, true);
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

  getClones()
    .then(clones => {
      seedAcc(clones)
        .then(result => {
          helpers.killProcess();
          process.exit();
        })
        .catch(error => {
          throw new Error(error);
        });
    });
})();