// npm modules
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'express-jwt';
import helmet from 'helmet';
import chalk from 'chalk';
import morgan from 'morgan';

// app module imports
import SERVER from './graphql';
import { ApiLogger } from './util/logger';
import { Helpers } from './util/helpers';

// variables
const app = express();
const PORT = process.env.PORT;
const db = 'mongodb://localhost:27017/joeyDb';
const log = console.log;
const apiLogger = new ApiLogger();
const helpers = new Helpers();
const logger = apiLogger.getLogger();

// JWT middleware to automatically send user decoded from token in request
const authMiddleware = jwt({
  secret: process.env.JOEYDBSECRET,
  credentialsRequired: false
});

// Connect to MongoDB with Mongoose.
mongoose
  .connect(
    db,
    {
      useCreateIndex: true,
      useNewUrlParser: true
    }
  )
  .then(() => log(chalk.cyan('MongoDB connected')))
  .catch(err => log(chalk.red(err)));

// dependencies and error handling
app.use(
  helmet(),
  authMiddleware,
  morgan('dev', {
    skip: function (req, res) {
      const error = res.statusCode < 400;
      if (error && res.statusCode >= 300) {
        logger.info(`code: ${res.statusCode} | message: ${res.statusMessage} | client: ${req.headers['user-agent']} | body: ${helpers.jsonToString(req.body.query)}`);
      }
      return error;
    }, stream: process.stderr
  }),
  morgan('dev', {
    skip: function (req, res) {
      const error = res.statusCode >= 400;
      if (error) {
        logger.error(`code: ${res.statusCode} | message: ${res.statusMessage} | client: ${req.headers['user-agent']} | body: ${helpers.jsonToString(req.body.query)}`);
      }
      return error;
    }, stream: process.stdout
  }),
  (err, req, res, next) => {
    if (err) {
      try {
        switch (err.name) {
          case 'UnauthorizedError':
            logger.info(`Unauthorized request: ${err.name}`);
            res.status(err.status).json({ error: err.message, message: 'Invalid token! You must be logged in to do that!' });
            break;
          default:
            logger.error(`Server error: ${err.name}`);
            res.status(err.status).json({ error: err.message, message: err.name });
            break;
        }
      } catch (error) {
        logger.error(`Server error: ${error}`);
        res.status(500).json({ error, message: 'Server error. Something went wrong!' });
      }
    }
  }
);

// apply middleware to Apollo
SERVER.applyMiddleware({
  app,
  path: '/api'
});

// give the process a title for npm stop
process.title = process.argv[2];

// statt the server
const server = app.listen(PORT, () => {
  log(chalk.cyan(`Server is running at PORT ${PORT}`));
});

// here for hot module reloading if I ever get that working the way I want (seems unstable in previous attempts)
declare const module: any;
if (module.hot) {
  log(chalk.yellow('reloading module'));
  module.hot.accept();
  module.hot.dispose(() => server.close());
}

// here for clean shutdown when nodemon restarts
function gracefulShutdown(callback) {
  mongoose.connection.close(function () {
    log(chalk.yellow('Mongoose disconnected through nodemon restart'));
    callback();
  });
};
process.once('SIGUSR2', function () {
  gracefulShutdown(function () {
    log(chalk.yellow('nodemon killing process'));
    process.kill(process.pid, 'SIGUSR2');
  });
});
