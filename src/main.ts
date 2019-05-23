import express from 'express';
import mongoose from 'mongoose';
import jwt from 'express-jwt';
import helmet from 'helmet';

import SERVER from './graphql';

const app = express();
const PORT = 3000;
const db = 'mongodb://localhost:27017/joeyDb';

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
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(
  helmet(),
  authMiddleware,
  (err, req, res, next) => {
    if (err) {
      console.log('ERROR FROM MAIN', err.name);
      try {
        switch (err.name) {
          case 'UnauthorizedError':
            res.status(err.status).json({ error: err.message, message: 'Invalid token! You must be logged in to do that!' });
            break;
        }
      } catch (error) {
        res.status(500).json({ error, message: 'Server error. Something went wrong!' });
      }
    }
  }
);

SERVER.applyMiddleware({
  app,
  path: '/api'
});

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
