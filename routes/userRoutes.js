const express = require("express");
const { SignUp, signIn, getProfile, verifyToken } = require("../controller/userController");
const router = express.Router();

router.post("/signUp", SignUp);
router.post("/signIn", signIn);
router.get("/profile", verifyToken, getProfile);

module.exports = router;
