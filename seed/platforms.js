
(function () {
  const mongoose = require('mongoose');
  const chalk = require('chalk');

  // connect to DB
  mongoose.connect(
    'mongodb://localhost:27017/joeyDb',
    { useNewUrlParser: true }
  );
  // import mmodel
  require('../dist/models/Platform');
  const Platform = mongoose.model('Platform');

  // import json file from homeControl project
  const consoles = require('../../homeControl/server/db/consoles.json');
  const wishlist = require('../../homeControl/server/db/wlConsoles.json');

  // remove all entries and seed from json file
  function seedPlatforms() {
    Platform.remove({}, err => {
      if (!err) {
        consoles.forEach(item => {
          // console.log('item', item);
          const modsCleaned = item.mods.replace(';', ',').split(',').map(i => i.trim()).filter(i => i !== '');
          const newPlatform = {
            igdbId: (item.igdb && item.igdb.id) ? item.igdb.id : 9999,
            userId: '5ce92fd5a3b475711bdf9045',
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
            wishlist: false
          };
          console.log('item.mods', newPlatform.mods);
          const plat = new Platform(newPlatform);
          plat.createdTimestamp();
          plat.updatedTimestamp();
          plat.save();
          console.log(chalk.green.bold(`Added ${item.igdb.name}`));
        });
      } else {
        console.log(chalk.red.bold(err));
      }
    });
  }

  const result = seedPlatforms();
})();