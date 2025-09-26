const User = require("../models/userModels");
const bcrypt = require("bcrypt");

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
   const newUser= await user.save();

    res.status(201).json({
      status: 201,
      message: "User Created ",
      data:newUser
    });
  } catch (err) {
    res.status(404).json({
      message: "server error",
      error: err.message,
    });
  }
};


module.exports=SignUp;