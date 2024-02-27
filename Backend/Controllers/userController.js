const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const nodemailer = require('nodemailer');

//nodemailer
async function mailer(receiverEmail, code) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    requireTLS: true,
    secure: false,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'tripger.travel@gmail.com',
      pass: 'zlgeymjpiaxmebds',
    },
  });

  const info = await transporter.sendMail({
    from: 'tripger.travel@agmail.com', // sender address
    to: `${receiverEmail}`, // list of receivers
    subject: 'SignUp Verification ✔', // Subject line
    text: `Your verification code is ${code}`, // plain text body
    html: `<b>Your verification code is ${code}</b>`, // html body
  });

  console.log('Message sent: %s', info.messageId);

  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

//Singup Functionality Controller or Create User
async function createUser(req, res) {
  const {name, email, country, password} = req.body;
  const user = new User({
    name,
    email,
    country,
    password,
  });

  try {
    await user.save();
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
    console.log(token);
    res.json({
      message: 'User Created Successfully',
      user: user,
      token,
    });
  } catch (err) {
    res.json({
      message: 'This email is already exists',
    });
  }
}

//Verification of user by checking jwt token
async function verifyUser(req, res) {
  const {email, name, country, password} = req.body;
  if (!name || !email || !country || !password) {
    return res.json({
      message: 'Please add all the field for signup',
    });
  }

  User.findOne({email: email}).then(async savedUser => {
    if (savedUser) {
      return res.json({
        message: 'This email is already exists',
      });
    }

    try {
      let verificationCode = Math.floor(100000 + Math.random() * 900000);
      let userDetails = [
        {
          name,
          email,
          password,
          country,
          verificationCode,
        },
      ];
      await mailer(email, verificationCode);
      res.json({
        message: 'Verification code sent to your email',
        uData: userDetails,
      });
    } catch (err) {
      console.log(err);
    }
  });
}

//getAllUsers functionality Controller
async function getAllUsers(req, res) {
  try {
    const allUsers = await User.find();
    res.json({
      messgae: 'All users from database are found successfully',
      allUsers,
    });
  } catch (error) {
    res.json({
      message: 'Something Went Wrong',
    });
  }
}

//getSingleUser functionality controller
async function getSingleUser(req, res) {
  const {id} = req.params;
  console.log(id);
  try {
    const singleUser = await User.findById(id);
    return res.json({
      message: 'Single User get Successfully',
      singleUser,
    });
  } catch (error) {
    return res.json({error});
  }
}

//Update user functionality controller
async function updateUser(req, res) {
  const {id} = req.params;
  try {
    const updatedUser = await User.findByIdAndUpdate({_id: id}, req.body, {
      new: true,
    });
    res.json({
      message: 'User updated Successfully',
      updatedUser,
    });
  } catch (error) {
    res.json({error});
  }
}

//delete user functionality controller
async function deleteUser(req, res) {
  const {id} = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete({_id: id});
    res.json({
      message: 'user Deleted Successfully',
      deletedUser,
    });
  } catch (error) {
    res.json({error});
  }
}

//Sign In or Login functionality controller
async function loginUser(req, res) {
  const {email, password} = req.body;
  if (!email || !password) {
    return res.json({
      message: 'Please add email and password',
    });
  }

  const savedUser = await User.findOne({email: email});
  // console.log(savedUser._id.toHexString());

  if (!savedUser) {
    return res.json({
      message: 'This is not a saved user',
    });
  }

  try {
    bcrypt.compare(password, savedUser.password, (err, result) => {
      if (result) {
        console.log('password matched');
        const token = jwt.sign({_id: savedUser._id}, process.env.JWT_SECRET);
        // console.log(token);
        res.send({
          message: 'User LogIn Successful',
          token,
          savedUser,
        });
      } else {
        console.log('password does not match');
        return res.json({
          message: 'Wrong Password',
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  createUser,
  verifyUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  loginUser,
};
