const express = require('express');
const {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  verifyUser,
  loginUser,
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
