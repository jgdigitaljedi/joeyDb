
(function () {
  const chalk = require('chalk');
  const helpers = require('./helpers');

  // setup mongoose
  const mongoose = helpers.mongoose;
  require('../dist/models/Platform');
  require('../dist/models/AVDevice');
  const Platform = mongoose.model('Platform');
  const AVDevice = mongoose.model('AVDevice');

  // import json file from homeControl project
  const consoles = require('../../homeControl/server/db/consoles.json');
  const wishlist = require('../../homeControl/server/db/wlConsoles.json');

  const computers = [15, 75];
  const handhelds = [33, 22, 35, 120, 57, 123, 57, 24, 38, 20, 37, 130];

  function getCategory(id) {
    if (computers.indexOf(id) >= 0) {
      return 'computer';
    }
    if (handhelds.indexOf(id) >= 0) {
      return 'portable console';
    }
    return 'console';
  }

  function makePlatform(item, joey, modsCleaned, ports, tv, wishlist) {
    return {
      igdbId: (item.igdb && item.igdb.id) ? item.igdb.id : 9999,
      user: joey._id,
      name: (item.igdb && item.igdb.name) ? item.igdb.name : '',
      alternative_name: (item.gb && item.gb.aliases) ? item.gb.aliases.replace(/(\r\n|\n|\r)/gm, ', ') : null,
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
      wishlist,
      category: getCategory(item.igdb.id),
      connectionChain: [
        {
          device: ports,
          order: 1,
          usesInput: 'HDMI',
          usesChannel: (Math.floor(Math.random() * (9))).toString()
        },
        {
          device: tv,
          order: 2,
          usesInput: 'HDMI',
          usesChannel: `HDMI${Math.floor(Math.random() * (5))}`
        }
      ],
      room: 'living room'
    };
  }

  // get admin user
  function seedPlatforms() {
    return new Promise((resolve, reject) => {
      helpers.joey.then(result => {
        joey = result;

        // remove previous entries
        Platform.deleteMany({}, err => {
          AVDevice.find({}, (err, devices) => {
            const ports = devices[0]._id;
            const tv = devices[8]._id;
            if (!err) {
              // add consoles from other project
              consoles.forEach((item, index) => {
                const modsCleaned = item.mods.replace(';', ',').split(',').map(i => i.trim()).filter(i => i !== '');
                const newPlatform = makePlatform(item, joey, modsCleaned, ports, tv, false);
                const plat = new Platform(newPlatform);
                plat.createdTimestamp();
                plat.updatedTimestamp();
                plat.save();
                console.log(chalk.cyan.bold(`Added ${item.igdb.name}`));
                if ((index + 1) === consoles.length) {
                  console.log(chalk.green.bold(`ADDED ALL PLATFORMS SUCCESSFULLY`));
                }
              });
              wishlist.forEach((item, index) => {
                const modsCleaned = item.mods.replace(';', ',').split(',').map(i => i.trim()).filter(i => i !== '');
                const newPlatform = makePlatform(item, joey, modsCleaned, ports, tv, true);
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
    });
  }

  seedPlatforms()
    .then(result => {
      helpers.killProcess(true);
    })
    .catch(error => {
      helpers.killProcess(true);
    });
})();