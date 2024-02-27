const mongoose = require('mongoose');
require('dotenv').config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Database is Connected');
  })
  .catch(err => {
    console.log('Database is not connected' + err);
  });
