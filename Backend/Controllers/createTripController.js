const Trip = require('../Models/CreateTrip');
const multer = require('multer');

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

// Update single trip member add functionality controller
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

//get Individual Member data in a trip controller

async function getMemberDetailsById(req, res) {
  const {tripId, memberId} = req.params;

  try {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({message: 'Trip not found'});
    }

    const member = trip.members.find(
      member => member._id.toString() === memberId,
    );
    if (!member) {
      return res.status(404).json({message: 'Member not found in the trip'});
    }

    res.json({member});
  } catch (error) {
    res
      .status(500)
      .json({message: 'Error retrieving member details', error: error.message});
  }
}

//Update additional Money functionality controller
async function updateAdditionalAmount(req, res) {
  const {tripId, memberId} = req.params;
  const {additionalAmount} = req.body;

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({message: 'Trip not found'});
    }

    const member = trip.members.find(
      member => member._id.toString() === memberId,
    );

    if (!member) {
      return res.status(404).json({message: 'Member not found in the trip'});
    }

    // Remove null values from additionalAmounts array
    member.additionalAmounts = member.additionalAmounts.filter(
      amount => amount !== null,
    );

    member.additionalAmounts.push(additionalAmount);
    await trip.save();

    res.json({
      message: 'Additional amount updated successfully',
      updatedTrip: trip,
    });
  } catch (error) {
    res
      .status(500)
      .json({message: 'Something went wrong', error: error.message});
  }
}

//update member name functionality controller
async function updateMemberName(req, res) {
  const {tripId, memberId} = req.params;
  const {newName} = req.body;

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({message: 'Trip not found'});
    }

    const member = trip.members.find(
      member => member._id.toString() === memberId,
    );

    if (!member) {
      return res.status(404).json({message: 'Member not found in the trip'});
    }

    member.name = newName; // Update member's name
    await trip.save();

    res.json({
      message: 'Member name updated successfully',
      updatedMember: member,
    });
  } catch (error) {
    res
      .status(500)
      .json({message: 'Something went wrong', error: error.message});
  }
}

//delete individual Member
async function deleteMemberById(req, res) {
  const {tripId, memberId} = req.params;

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({message: 'Trip not found'});
    }

    // Remove the member from the trip
    trip.members = trip.members.filter(
      member => member._id.toString() !== memberId,
    );

    await trip.save();

    res.json({message: 'Member deleted successfully', updatedTrip: trip});
  } catch (error) {
    console.error('Error deleting member:', error);
    res
      .status(500)
      .json({message: 'Something went wrong', error: error.message});
  }
}

//Update cost details

const updateTripCosts = async (req, res) => {
  const {tripId} = req.params;
  const {category, amount, description} = req.body;

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({message: 'Trip not found'});
    }
    trip.costs.push({category, amount, description});
    await trip.save();
    res.status(200).json({message: 'Cost added successfully', trip});
  } catch (error) {
    console.error('Error updating trip costs:', error);
    res.status(500).json({message: 'Failed to update trip costs'});
  }
};

//get Cost Details Function
const getTripCosts = async (req, res) => {
  const {tripId} = req.params;

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({message: 'Trip not found'});
    }
    res.status(200).json({costs: trip.costs});
  } catch (error) {
    console.error('Error fetching trip costs:', error);
    res.status(500).json({message: 'Failed to fetch trip costs'});
  }
};

//get All members in a trip controller function
async function getAllMembers(req, res) {
  const {tripId} = req.params;

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({message: 'Trip not found'});
    }
    res.json(trip.members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({message: 'Failed to fetch members'});
  }
}

// Define Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/tripsImage');
  },
  filename: function (req, file, cb) {
    const tripId = req.params.id;
    const date = Date.now();
    const originalName = file.originalname;
    const filename = `${tripId}-${date}-${originalName}`;
    cb(null, filename);
  },
});

// Create Multer instance
const upload = multer({storage: storage});
const uploadMiddleware = upload.single('tripsImage');

//Upload profile image functionality controller
async function uploadTripsImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({error: 'No file uploaded'});
    }

    const tripId = req.params.id;
    const tripsImagePath = req.file.path;

    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      {tripsImage: tripsImagePath},
      {new: true},
    );
    //console.log(updatedTrip);

    if (!updatedTrip) {
      return res.status(404).json({error: 'Trip not found'});
    }

    res.status(200).json({
      message: 'Trip image uploaded successfully',
      trip: updatedTrip.tripsImage,
    });
  } catch (error) {
    console.error('Error uploading trip image:', error);
    res.status(500).json({error: 'Internal server error'});
  }
}

//get Profile Image functionality
const getTripImage = async (req, res) => {
  try {
    const tripId = req.params.id;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({error: 'Trip not found'});
    }

    if (!trip.tripsImage) {
      // If user doesn't have a profile image, return a default image URL
      return res.status(200).json({
        message: 'no image uploaded',
      });
    } else {
      return res.json({
        message: 'image already uploaded',
        image: trip.tripsImage,
      });
    }
  } catch (error) {
    console.error('Error retrieving trip image:', error);
    res.status(500).json({error: 'Internal server error'});
  }
};

module.exports = {
  createTrip,
  getTripDetails,
  getSingleTripDetails,
  getTripDetailsById,
  updateTripDetails,
  getMemberDetailsById,
  updateAdditionalAmount,
  updateMemberName,
  deleteMemberById,
  updateTripCosts,
  getTripCosts,
  getAllMembers,
  uploadMiddleware,
  uploadTripsImage,
  getTripImage,
};
