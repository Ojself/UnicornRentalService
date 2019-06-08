const mongoose = require('mongoose');

//  ~/server/.env for more information
const uri = process.env.MONGODB_URI || `mongodb://localhost/checkYourDotEnv`;

mongoose
  .connect(uri, { useNewUrlParser: true })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error('Error connecting to mongo', err);
  });
