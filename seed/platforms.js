
(function () {
  const chalk = require('chalk');
  const helpers = require('./helpers');

  // setup mongoose
  const mongoose = helpers.mongoose;
  require('../dist/models/Platform');
  const Platform = mongoose.model('Platform');

  // import json file from homeControl project
  const consoles = require('../../homeControl/server/db/consoles.json');
  const wishlist = require('../../homeControl/server/db/wlConsoles.json');

  // get admin user
  function seedPlatforms() {
    return new Promise((resolve, reject) => {
      helpers.joey.then(result => {
        joey = result;

        // remove previous entries
        Platform.remove({}, err => {
          if (!err) {
            // add consoles from other project
            consoles.forEach((item, index) => {
              const modsCleaned = item.mods.replace(';', ',').split(',').map(i => i.trim()).filter(i => i !== '');
              const newPlatform = {
                igdbId: (item.igdb && item.igdb.id) ? item.igdb.id : 9999,
                userId: joey.id,
                name: (item.igdb && item.igdb.name) ? item.igdb.name : '',
                alternative_name: (item.gb && item.gb.aliases) ? item.gb.aliases : null,
                generation: (item.igdb && item.igdb.generation) ? item.igdb.generation : null,
                version_name: (item.igdb && item.igdb.version) ? item.igdb.version : null,
                first_release_date: null,
                storage: item.storage,
                unit: item.unit,
                mods: modsCleaned.length ? modsCleaned : null,
                notes: item.notes,
                box: item.box,
                connectedBy: item.connectedBy,
                upscaler: item.upscaler,
                condition: item.condition,
                datePurchased: item.datePurchased,
                purchasePrice: item.purchasePrice,
                howAcquired: item.howAcquired,
                region: (item.igdb && item.igdb.id === 4) ? 'Japan' : 'US',
                ghostConsole: item.ghostConsole,
                wishlist: false,
                category: 'console'
              };
              const plat = new Platform(newPlatform);
              plat.createdTimestamp();
              plat.updatedTimestamp();
              plat.save();
              console.log(chalk.cyan.bold(`Added ${item.igdb.name}`));
              if ((index + 1) === consoles.length) {
                console.log(chalk.green.bold(`ADDED ALL PLATFORMS SUCCESSFULLY`));
                // resolve(true);
              }
            });
            wishlist.forEach((item, index) => {
              const modsCleaned = item.mods.replace(';', ',').split(',').map(i => i.trim()).filter(i => i !== '');
              const newPlatform = {
                igdbId: (item.igdb && item.igdb.id) ? item.igdb.id : 9999,
                userId: joey.id,
                name: (item.igdb && item.igdb.name) ? item.igdb.name : '',
                alternative_name: (item.gb && item.gb.aliases) ? item.gb.aliases : null,
                generation: (item.igdb && item.igdb.generation) ? item.igdb.generation : null,
                version_name: (item.igdb && item.igdb.version) ? item.igdb.version : null,
                first_release_date: null,
                storage: item.storage,
                unit: item.unit,
                mods: modsCleaned.length ? modsCleaned : null,
                notes: item.notes,
                box: item.box,
                connectedBy: item.connectedBy,
                upscaler: item.upscaler,
                condition: item.condition,
                datePurchased: item.datePurchased,
                purchasePrice: item.purchasePrice,
                howAcquired: item.howAcquired,
                region: (item.igdb && item.igdb.id === 4) ? 'Japan' : 'US',
                ghostConsole: item.ghostConsole,
                wishlist: true,
                category: 'console'
              };
              const plat = new Platform(newPlatform);
              plat.createdTimestamp();
              plat.updatedTimestamp();
              plat.save();
              console.log(chalk.cyan.bold(`Added ${item.igdb.name}`));
              if ((index + 1) === wishlist.length) {
                console.log(chalk.green.bold(`ADDED ALL WISHLIST PLATFORMS SUCCESSFULLY`));
                resolve(true);
              }
            });
          } else {
            console.log(chalk.red.bold(err));
            reject(err);
          }
        });
      });
    });
  }

  seedPlatforms()
    .then(result => {
      mongoose.connection.close();
    })
    .catch(error => {
      mongoose.connection.close();
    });
})();