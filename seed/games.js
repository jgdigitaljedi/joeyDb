(function () {
  const chalk = require('chalk');
  const helpers = require('./helpers');

  // setup mongoose
  const mongoose = helpers.mongoose;
  require('../dist/models/Platform');
  require('../dist/models/Game');
  const Platform = mongoose.model('Platform');
  const Game = mongoose.model('Game');

  // import json file from homeControl project
  const games = require('../../homeControl/server/db/games.json');
  const wishlist = require('../../homeControl/server/db/wlGames.json');

  // xbox backward compatibility lists
  const XboxToXboxOne = require('../src/static/xboxToXboxOne.json');
  const XboxToXboxThreeSixty = require('../src/static/xboxToXboxThreeSixty.json');
  const Xbox360ToXboxOne = require('../src/static/xbox360ToXboxOne.json');

  function xboxBkwdLogic(id, data) {
    const filtered = data.filter(d => d.igdbId === id);
    return filtered && filtered.length
      ? Object.assign({}, { bkwd: true, notes: filtered[0].notes })
      : Object.assign({}, { bkwd: false, notes: null });
  }

  function xboxBkwdLookup(game) {
    if (game.platform.id === 11) {
      return {
        xboxOneBkwd: xboxBkwdLogic(game.id, XboxToXboxOne),
        threeSixtyBkwd: xboxBkwdLogic(game.id, XboxToXboxThreeSixty)
      };
    } else if (game.platform.id === 12) {
      return {
        xboxOneBkwd: xboxBkwdLogic(game.id, Xbox360ToXboxOne),
        threeSixtyBkwd: { bkwd: false, notes: null }
      };
    }
    return {
      xboxOneBkwd: { bkwd: false, notes: null },
      threeSixtyBkwd: { bkwd: false, notes: null }
    };
  }

  function makeGame(game, platId, joey, wishlist) {
    const bkwd = xboxBkwdLookup({ id: game.igdb.id, platform: { id: platId[0].igdbId } });
    return {
      user: joey.id,
      igdbId: game.igdb.id,
      name: game.igdb.name,
      ageRating: game.igdb.esrb,
      aggregatedRating: game.igdb.total_rating,
      aggregatedRatingCount: game.igdb.total_rating_count,
      alternativeNames: game.gb.aliases,
      series: null,
      box: false,
      cover: game.gb.image,
      summary: game.gb.deck,
      platform: platId && platId.length ? platId[0]._id : null,
      genres: game.igdb.genres,
      firstReleaseDate: game.igdb.first_release_date,
      gameBeaten: null,
      xboxOneBkwd: bkwd.xboxOneBkwd,
      threeSixtyBkwd: bkwd.threeSixtyBkwd,
      pricePaid: parseFloat(game.pricePaid) > 0 ? parseFloat(game.pricePaid) : null,
      physical: game.physical ? true : false,
      case: game.case,
      condition: game.condition,
      manual: game.cib ? game.cib : false,
      pirated: game.pirated ? game.pirated : false,
      maxLocalPlayerNumber: parseInt(game.multiplayerNumber) > 0 ? parseInt(game.multiplayerNumber) : null,
      datePurchased: game.datePurchased,
      howAcquired: game.howAcquired,
      region: 'US',
      notes: game.notes,
      wishlist
    };
  }

  // get admin user
  function seedGames() {
    return new Promise((resolve, reject) => {
      helpers.joey.then(result => {
        joey = result;

        // remove previous entries
        Game.deleteMany({}, err => {
          Platform.find({}, (err, platforms) => {
            if (!err) {
              games.forEach((game, index) => {
                const platId = platforms.filter(plat => plat.igdbId === game.consoleIgdbId);
                const gameData = makeGame(game, platId, joey, false);
                const newGame = new Game(gameData);
                newGame.createdTimestamp();
                newGame.updatedTimestamp();
                newGame.save();
                console.log(chalk.cyan.bold(`Added ${game.igdb.name}`));
                if ((index + 1) === games.length) {
                  console.log(chalk.green.bold(`ADDED ALL GAMES SUCCESSFULLY`));
                }
              });
              wishlist.forEach((game, index) => {
                const platId = platforms.filter(plat => plat.igdbId === game.consoleIgdbId);
                const gameData = makeGame(game, platId, joey, true);
                const newGame = new Game(gameData);
                newGame.createdTimestamp();
                newGame.updatedTimestamp();
                newGame.save();
                console.log(chalk.cyan.bold(`Added ${game.igdb.name}`));
                if ((index + 1) === wishlist.length) {
                  console.log(chalk.green.bold(`ADDED ALL WISHLIST GAMES SUCCESSFULLY`));
                  setTimeout(() => {
                    resolve(true);
                  }, 5000);
                }
              });
            }
          });
        });
      });
    });
  }

  seedGames()
    .then(result => {
      helpers.killProcess(true);
      process.exit();
    })
    .catch(error => {
      helpers.killProcess(true);
      process.exit(1);
    });
})();