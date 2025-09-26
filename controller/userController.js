const User = require("../models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const CreateJwtToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRESIN || "1h",
  });
};

// verify jwt  token
const verifyToken = async (req, res, next) => {
  const headerToken = req.headers["authorization"];
  console.log(headerToken);

  if (!headerToken) {
    return res.status(401).json({
      message: "Authorization header missing",
      status: 401,
      data: {},
    });
  }
  const token = headerToken.split(" ")[1];
  if (!token) {
    res.status(404).json({
      message: "Token not valid",
      status: 404,
      data: {},
    });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      res.status(404).json({
        message: "token not valid",
        status: 404,
        data: {},
      });
    }
    req.user = payload;
    next();
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

const getProfile = async (req, res) => {
  const user = await User.findOne({ _id: req.user.id }).select("-password -__v");
  res.status(200).json({
    message: "Profiles",
    status: 200,
    data: user,
  });
};

module.exports = { SignUp, signIn, getProfile, verifyToken };
