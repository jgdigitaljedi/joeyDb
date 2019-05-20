import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import graphqlHTTP from 'express-graphql';

import schema from './graphql/';

const app = express();
const PORT = 3000;
const db = 'mongodb://localhost:27017/joeyDb';

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
  bodyParser.json(),
  graphqlHTTP({
    graphiql: true,
    schema
  }));

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});