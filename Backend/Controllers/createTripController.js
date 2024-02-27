const Trip = require('../Models/CreateTrip');

//Create Trip Functionality controller
async function createTrip(req, res) {
  req.body.userInfo = req.user._id;
  const {
    tripName,
    tripLocation,
    startingFrom,
    startDate,
    endDate,
    members,
    userInfo,
  } = req.body;
  const trip = new Trip({
    tripName,
    tripLocation,
    startingFrom,
    startDate,
    endDate,
    members,
    userInfo,
  });

  try {
    await trip.save();
    res.json({message: 'Trip saved successfully', tripDetails: trip});
  } catch (error) {
    res.json({
      message: `Something Wrong:${error}`,
    });
  }
}

//All trips get functionality controller
async function getTripDetails(req, res) {
  try {
    const All_Trips = await Trip.find().populate('userInfo');
    res.json({
      message: 'All trips get Successfully',
      All_Trips,
    });
  } catch (error) {
    res.json({
      message: 'Something Went Wrong on getting All trips Data',
    });
  }
}

//get trip details based on id functionality
async function getTripDetailsById(req, res) {
  const userId = req.user._id;
  try {
    const All_Trips = await Trip.find({userInfo: userId}).populate('userInfo');
    res.json({
      message: 'All trips get Successfully',
      All_Trips,
    });
  } catch (error) {
    res.json({
      message: 'Something Went Wrong on getting All trips Data',
    });
  }
}

//Single Trip details get functionality controller
async function getSingleTripDetails(req, res) {
  const {id} = req.params;
  try {
    const Single_Trip = await Trip.findById(id).populate('userInfo');
    res.json({
      message: 'single trip details get Successfully',
      Single_Trip,
    });
  } catch (error) {
    res.json({
      message: 'Something Went Wrong on getting single trip Data',
    });
  }
}

// Update single trip details functionality controller
async function updateTripDetails(req, res) {
  const {id} = req.params;
  const {newMembers} = req.body;

  try {
    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({message: 'Trip not found'});
    }

    if (newMembers && newMembers.length > 0) {
      newMembers.forEach(member => {
        trip.members.push(member);
      });
    }

    await trip.save();

    res.json({message: 'Trip details updated successfully', updatedTrip: trip});
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while updating trip details',
      error: error.message,
    });
  }
}

async function updateTripAddMoney(req, res) {
  const {trips_id, additionalMoney} = req.body;

  try {
    // Find the trip by ID
    const trip = await Trip.findById(trips_id);

    console.log(trip);

    if (!trip) {
      return res.status(404).json({message: 'Trip not found'});
    }

    // Update initial amount based on new money and additional money
    if (additionalMoney) {
      trip.initialAmount += additionalMoney;
    }

    // Save the updated trip
    await trip.save();

    return res.json({message: 'Trip updated successfully', tripDetails: trip});
  } catch (error) {
    return res
      .status(500)
      .json({message: `Something went wrong: ${error.message}`});
  }
}

module.exports = {
  createTrip,
  getTripDetails,
  getSingleTripDetails,
  getTripDetailsById,
  updateTripDetails,
  updateTripAddMoney,
};
