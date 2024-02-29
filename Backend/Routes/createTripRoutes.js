const express = require('express');
const route = express.Router();

const {authenticate, accessTo} = require('../Middlewares/AuthTokenRequired.js');
const {
  createTrip,
  getTripDetails,
  getSingleTripDetails,
  getTripDetailsById,
  updateTripDetails,
  updateAdditionalAmount,
  getMemberDetailsById,
} = require('../Controllers/createTripController.js');

//Create Trip Route
route.post('/createTrip', authenticate, createTrip);

//Get All Trips Route
route.get('/getAllTrips', authenticate, getTripDetails);

//get Trips based on userInfo id Route
route.get('/getAllTripsById/:userId', authenticate, getTripDetailsById);

//get single trip route
route.get('/getSingleTrip/:id', authenticate, getSingleTripDetails);

// update add member in a trip route
route.patch('/updateSingleTrip/addMember/:id', authenticate, updateTripDetails);

//Get Single Member Details in a trip route
route.get('/:tripId/members/:memberId', authenticate, getMemberDetailsById);

//update Additional amount of member route
route.patch(
  '/additional-amount/:tripId/members/:memberId',
  authenticate,
  updateAdditionalAmount,
);

module.exports = route;
