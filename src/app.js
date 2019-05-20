import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import graphqlHTTP from 'express-graphql';
const jwt = require('express-jwt');
const helmet = require('helmet');

import schema from './graphql/';

const app = express();
const PORT = 3000;
const db = 'mongodb://localhost:27017/joeyDb';

const authMiddleware = jwt({
  secret: process.env.JOEYDBSECRET
})

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
  '/graphql',
  authMiddleware,
  helmet(),
  bodyParser.json(),
  graphqlHTTP({
    graphiql: true,
    schema
  }));

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});