const express = require("express");
const { SignUp, signIn } = require("../controller/userController");
const router = express.Router();

router.post("/signUp", SignUp);
router.post("/signIn", signIn);

module.exports = router;
