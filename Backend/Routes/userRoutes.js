const express = require('express');
const {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  verifyUser,
  loginUser,
  uploadProfileImage,
  uploadMiddleware,
  getProfileImage,
} = require('../Controllers/userController');

const {authenticate, accessTo} = require('../Middlewares/AuthTokenRequired.js');
const route = express.Router();

//Signup Route for user
route.post('/signup', createUser);

//verify users Routes for user
route.post('/verify', verifyUser);

//get all users Route
route.get('/getAllUsers', getAllUsers);

//get Single User Route
route.get('/getSingleUser/:id', authenticate, getSingleUser);

//update user route
route.patch('/updateUser/:id', authenticate, updateUser);

//update user profile image route
route.patch(
  '/updateUser/:id/profileImage',
  authenticate,
  uploadMiddleware,
  uploadProfileImage,
);

//get Profile image route
route.get('/profileImage/:id', authenticate, getProfileImage);

//delete user Route
route.delete(
  '/deleteUser/:id',
  authenticate,
  accessTo(['admin', 'moderator', 'user']),
  deleteUser,
);

//Sing In or Login user Route
route.post('/login', loginUser);

module.exports = route;
