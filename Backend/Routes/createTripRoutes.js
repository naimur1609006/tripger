const express = require('express');
const route = express.Router();

const {authenticate, accessTo} = require('../Middlewares/AuthTokenRequired.js');
const {
  createTrip,
  getTripDetails,
  getSingleTripDetails,
  getTripDetailsById,
  updateTripDetails,
  updateTripAddMoney,
} = require('../Controllers/createTripController.js');

//Create Trip Route
route.post('/createTrip', authenticate, createTrip);

//Get All Trips Route
route.get('/getAllTrips', authenticate, getTripDetails);

//get Trips based on userInfo id Route
route.get('/getAllTripsById/:userId', authenticate, getTripDetailsById);

//get single trip route
route.get('/getSingleTrip/:id', authenticate, getSingleTripDetails);

// update single trip details route
route.patch('/updateSingleTrip/:id', authenticate, updateTripDetails);

route.patch('/member/:id', updateTripAddMoney);

module.exports = route;
