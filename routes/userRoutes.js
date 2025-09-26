const express = require("express")
const SignUp = require("../controller/userController")
const router = express.Router()

router.post("/signUp",SignUp)

module.exports=router;