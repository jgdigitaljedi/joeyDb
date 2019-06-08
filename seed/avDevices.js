(function () {
  const chalk = require('chalk');
  const helpers = require('./helpers');
  const devices = require('./data').devices;

  // setup mongoose
  const mongoose = helpers.mongoose;
  require('../dist/models/AVDevice');
  const AVDevice = mongoose.model('AVDevice');

  function seedAVDevices() {
    return new Promise((resolve, reject) => {
      helpers.joey.then(result => {
        joey = result;

        // remove previous entries
        AVDevice.deleteMany({}, err => {
          if (!err) {
            devices.forEach((device, index) => {
              const newDevice = new AVDevice(device);
              newDevice.user = joey._id;
              newDevice.createdTimestamp();
              newDevice.updatedTimestamp();
              newDevice.save().then(saved => {
                if (saved) {
                  console.log(chalk.cyan.bold(`Added ${device.name}`));
                  if ((index + 1) === devices.length) {
                    console.log(chalk.green.bold(`ADDED ALL AV DEVICES SUCCESSFULLY`));
                    resolve(true);
                  }
                } else {
                  reject(true);
                }
              });
            });
          } else {
            console.log(chalk.red.bold(`An error occurred seeding devices: `, err));
          }
        });
      });
    });
  }

  seedAVDevices()
    .then(result => {
      helpers.killProcess();
      process.exit();
    })
    .catch(error => {
      throw new Error(error);
    });
})();