const User = require("../models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const CreateJwtToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRESIN || "1h",
  });
};

const SignUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(401).json({
        status: 401,
        message: "User Already Exist",
        data: {},
      });
    }

    const passHash = await bcrypt.hash(password, 10);
    const passObj = {
      firstName,
      lastName,
      email,
      password: passHash,
    };
    const user = new User(passObj);
    const newUser = await user.save();

    res.status(201).json({
      status: 201,
      message: "User Created ",
      data: newUser,
    });
  } catch (err) {
    res.status(500).json({
      message: "server error",
      error: err.message,
    });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isExistingUser = await User.findOne({ email: email });

    if (!isExistingUser) {
      res.status(401).json({
        message: "User not found",
        status: 401,
        data: {},
      });
    }
    const match = await bcrypt.compare(password, isExistingUser.password);
    if (!match) {
      res.status(401).json({
        message: "Password not match try again",
        status: 401,
        data: {},
      });
    }
    const userPayload = {
      id: isExistingUser._id,
      email: isExistingUser.email,
    };

    const token = await CreateJwtToken(userPayload);

    res.status(201).json({
      message: "User login successfully",
      status: 201,
      data: { isExistingUser, token },
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      error: error.message,
    });
  }
};

module.exports = { SignUp, signIn };
