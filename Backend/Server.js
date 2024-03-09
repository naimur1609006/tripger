const express = require('express');
const app = express();
const dotenv = require('dotenv');

const userRoute = require('./Routes/userRoutes');
const requireToken = require('./Middlewares/AuthTokenRequired.js');
const createTripRoute = require('./Routes/createTripRoutes');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/upload', express.static('upload'));

dotenv.config();
require('./db');

const port = 8080;

//Routing --> USER
app.use('/api/user', userRoute);

//Routing --> CREATETRIP
app.use('/api/trip', createTripRoute);

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
