const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const authenticate = (req, res, next) => {
  // try {
  //   const token = req.headers.authorization;
  //   const decode = jwt.verify(token, process.env.JWT_SECRET);
  //   req.user = decode;
  //   next();
  // } catch (error) {
  //   res.json({
  //     message: 'authentication failed',
  //   });
  // }
  console.log(req.headers);

  const {authorization} = req.headers;

  if (!authorization) {
    return res.json({
      error: 'Key not given',
    });
  }

  const token = authorization;
  console.log(token);

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.json({
        error: 'token invalid',
      });
    }

    const {_id} = payload;
    User.findById(_id).then(userData => {
      req.user = userData;
      next();
    });
  });
};

const accessTo = arr => {
  return function accessMiddleware(req, res, next) {
    console.log({arr});
    console.log({user: req.user.role});
    if (!arr.includes(req.user.role)) {
      return res.json({
        message: `You don't have any permission to delete`,
      });
    }

    next();
  };
};

module.exports = {authenticate, accessTo};
