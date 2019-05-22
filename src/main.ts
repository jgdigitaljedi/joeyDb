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
  authMiddleware,
  helmet(),
);

SERVER.applyMiddleware({
  app,
  path: '/api'
});

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});